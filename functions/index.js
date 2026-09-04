// -----------------------------------------------------------------------
// Server-side auth for the AP CSA practice app.
//
// Why this exists: the app used to send real student PINs and the teacher's
// password hash straight to the browser and compare them there in plain
// JavaScript. Combined with Firestore rules that allowed anyone to read or
// write anything ("allow read, write: if true"), that meant any client --
// browser console, curl, a script from home -- could read every student's
// real PIN and the teacher's password hash directly, or overwrite any
// record, without ever going through the app's own PIN/password screens.
//
// These functions move the actual PIN/password *comparison* here, using the
// Admin SDK (which is never subject to Firestore security rules and never
// hands raw secrets back to the caller). On success they mint a custom claim
// on the caller's Firebase Auth ID token -- role: "teacher", or
// role: "student" + studentDocId for a specific student -- and the
// accompanying firestore.rules file trusts those claims instead of trusting
// whatever the client claims about itself. They also track failed attempts
// per record and lock it out for a few minutes after repeated wrong guesses,
// which closes a brute-force hole that Firestore rules alone can't close
// (a 4-digit PIN is only 10,000 possibilities -- trivial to guess through
// without a limiter).
// -----------------------------------------------------------------------
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const crypto = require("crypto");

admin.initializeApp();
const db = admin.firestore();

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 5 * 60 * 1000; // 5 minutes

function sha256(str) {
  return crypto.createHash("sha256").update(String(str), "utf8").digest("hex");
}

function studentDocId(course, section, slug) {
  return `${course}_${section}_${slug}`;
}

function generatePin() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

// Minimal defensive placeholder for a roster entry that somehow has no
// student record yet (in normal use, the teacher's roster-import flow
// already creates every student's record with a real PIN before any student
// ever visits). This intentionally does NOT try to replicate the full
// curriculum-aware emptyStudent() shape from App.jsx -- it only needs to
// exist long enough for this PIN attempt to correctly fail (the student
// can't know a PIN that was just randomly generated), after which the
// teacher's existing roster/reset tools will overwrite it with a proper
// record the normal way.
function placeholderStudentRecord(displayName, course, idTag) {
  return {
    displayName: displayName || null,
    idTag: idTag || null,
    course,
    pin: generatePin(),
    createdAt: Date.now(),
    _placeholder: true,
  };
}

// --- Shared lockout bookkeeping, used for both student PINs and the ------
// --- teacher password. Fields are prefixed with "_" and are excluded    ---
// --- from client writes by firestore.rules, so only these functions     ---
// --- (via the Admin SDK) can ever change them.                          ---
function checkLockout(data) {
  const lockedUntil = (data && data._lockedUntil) || 0;
  if (lockedUntil > Date.now()) {
    const secondsLeft = Math.ceil((lockedUntil - Date.now()) / 1000);
    throw new HttpsError(
      "resource-exhausted",
      `Too many incorrect attempts. Try again in ${secondsLeft} second${secondsLeft === 1 ? "" : "s"}.`
    );
  }
}

async function registerFailure(ref, data) {
  const attempts = ((data && data._failedAttempts) || 0) + 1;
  const update = { _failedAttempts: attempts };
  if (attempts >= MAX_ATTEMPTS) {
    update._lockedUntil = Date.now() + LOCKOUT_MS;
    update._failedAttempts = 0;
  }
  await ref.set(update, { merge: true });
}

async function clearFailures(ref) {
  await ref.set(
    {
      _failedAttempts: admin.firestore.FieldValue.delete(),
      _lockedUntil: admin.firestore.FieldValue.delete(),
    },
    { merge: true }
  );
}

function requireSignedIn(request) {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Sign-in required.");
  }
}

function requireTeacher(request) {
  requireSignedIn(request);
  if (request.auth.token.role !== "teacher") {
    throw new HttpsError("permission-denied", "Teacher sign-in required.");
  }
}

// ---------------------------------------------------------------------------
// Student PIN check.
// Client sends {course, section, slug, pin, displayName, idTag}. On success,
// the caller's ID token gets {role: "student", studentDocId}; the client
// must then refresh its ID token before Firestore will let it read/write
// that student's own document.
// ---------------------------------------------------------------------------
exports.verifyStudentPin = onCall(async (request) => {
  requireSignedIn(request);
  const { course, section, slug, pin, displayName, idTag } = request.data || {};
  if (!course || !section || !slug || !pin) {
    throw new HttpsError("invalid-argument", "Missing course/section/slug/pin.");
  }

  const docId = studentDocId(course, section, slug);
  const ref = db.collection("students").doc(docId);
  const snap = await ref.get();
  let data = snap.exists ? snap.data() : null;

  if (!data) {
    data = placeholderStudentRecord(displayName, course, idTag);
    await ref.set(data);
  }

  checkLockout(data);

  if (String(data.pin) !== String(pin)) {
    await registerFailure(ref, data);
    throw new HttpsError("permission-denied", "Incorrect PIN.");
  }

  await clearFailures(ref);
  await admin.auth().setCustomUserClaims(request.auth.uid, {
    role: "student",
    studentDocId: docId,
  });
  return { ok: true };
});

// ---------------------------------------------------------------------------
// Teacher password flows.
// ---------------------------------------------------------------------------

// Lets the client show "set a password" vs "enter your password" without
// ever reading the settings/teacher document directly (that document is
// fully locked to clients in firestore.rules).
exports.checkTeacherPasswordExists = onCall(async (request) => {
  requireSignedIn(request);
  const snap = await db.collection("settings").doc("teacher").get();
  return { exists: !!(snap.exists && snap.data().passwordHash) };
});

// First-run only: sets the teacher password, but refuses if one is already
// set (so this can't be replayed later to silently overwrite a real
// password without proving you know the current one).
exports.setInitialTeacherPassword = onCall(async (request) => {
  requireSignedIn(request);
  const { password } = request.data || {};
  if (!password || password.length < 8) {
    throw new HttpsError("invalid-argument", "Password must be at least 8 characters.");
  }
  const ref = db.collection("settings").doc("teacher");
  const snap = await ref.get();
  if (snap.exists && snap.data().passwordHash) {
    throw new HttpsError("already-exists", "A teacher password is already set.");
  }
  await ref.set({ passwordHash: sha256(password) }, { merge: true });
  await admin.auth().setCustomUserClaims(request.auth.uid, { role: "teacher" });
  return { ok: true };
});

// Normal unlock: checks the password, and on success mints the "teacher"
// claim the same way verifyStudentPin mints a student claim.
exports.verifyTeacherPassword = onCall(async (request) => {
  requireSignedIn(request);
  const { password } = request.data || {};
  if (!password) {
    throw new HttpsError("invalid-argument", "Missing password.");
  }
  const ref = db.collection("settings").doc("teacher");
  const snap = await ref.get();
  const data = snap.exists ? snap.data() : null;

  checkLockout(data);

  if (!data || data.passwordHash !== sha256(password)) {
    await registerFailure(ref, data);
    throw new HttpsError("permission-denied", "Incorrect password.");
  }

  await clearFailures(ref);
  await admin.auth().setCustomUserClaims(request.auth.uid, { role: "teacher" });
  return { ok: true };
});

// Change password while already unlocked -- re-checks the current password
// server-side too (defense in depth against a stolen/left-open teacher
// session on a shared lab computer), then requires the "teacher" claim.
exports.changeTeacherPassword = onCall(async (request) => {
  requireTeacher(request);
  const { currentPassword, newPassword } = request.data || {};
  if (!newPassword || newPassword.length < 8) {
    throw new HttpsError("invalid-argument", "New password must be at least 8 characters.");
  }
  const ref = db.collection("settings").doc("teacher");
  const snap = await ref.get();
  const data = snap.exists ? snap.data() : null;
  if (!data || data.passwordHash !== sha256(currentPassword || "")) {
    throw new HttpsError("permission-denied", "Current password is incorrect.");
  }
  await ref.set({ passwordHash: sha256(newPassword) }, { merge: true });
  return { ok: true };
});
