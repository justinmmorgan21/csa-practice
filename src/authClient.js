// -----------------------------------------------------------------------
// Anonymous sign-in + Cloud Function calls, using plain fetch() throughout
// instead of the Firebase Auth / Functions SDKs -- for the same reason
// firestoreRest.js talks to Firestore via plain REST: the Firebase SDKs'
// internals fail inside Google Apps Script's sandboxed web app iframe
// ("client is offline" even though the network is fine), while plain
// fetch() calls to the same REST endpoints work correctly there.
//
// Every browser tab signs in anonymously the moment it needs to (invisible
// to the person using the app -- there's no separate "login" screen for
// this). That alone grants no special access; it just gives Firestore
// security rules and the Cloud Functions a real, server-verifiable identity
// to check custom claims against, instead of nothing at all. The actual
// access -- "you are this student" / "you are the teacher" -- only gets
// attached to that identity after the matching Cloud Function verifies a
// PIN or password server-side (see storage.js / auth.js).
// -----------------------------------------------------------------------
import { PROJECT_ID } from "./firebase";

// Firebase Web API key. This is not a secret in the way a server API key
// would be -- it's unavoidably embedded in every Firebase web app's client
// bundle, the same way PROJECT_ID already is, and by itself it grants no
// access to any data. Every real permission check now lives in
// firestore.rules and the Cloud Functions, not behind this key. Set via the
// VITE_FIREBASE_API_KEY environment variable at build time (see .env, or
// the GitHub Actions secret of the same name), matching how PROJECT_ID is
// configured in firebase.js.
const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY || "MISSING_VITE_FIREBASE_API_KEY";

// Cloud Functions region. Firebase defaults new functions to us-central1
// unless a project deliberately picks something else -- if this project's
// functions end up deployed to a different region, update this to match
// (the Firebase CLI prints each function's URL after every deploy).
const FUNCTIONS_REGION = "us-central1";

const AUTH_BASE = "https://identitytoolkit.googleapis.com/v1";
const TOKEN_BASE = "https://securetoken.googleapis.com/v1";
const FUNCTIONS_BASE = `https://${FUNCTIONS_REGION}-${PROJECT_ID}.cloudfunctions.net`;

// In-memory only -- deliberately NOT persisted across page loads. A fresh
// anonymous sign-in is free and invisible, and this app is used on shared
// classroom computers, so every full page reload starting over with no
// lingering "teacher" or "student" claim is the safer default (it matches
// how the app already requires re-entering a PIN/password after a reload).
let session = null; // { idToken, refreshToken, expiresAt, uid }
let signInPromise = null;

async function signInAnonymously() {
  const res = await fetch(`${AUTH_BASE}/accounts:signUp?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ returnSecureToken: true }),
  });
  if (!res.ok) throw new Error(`Anonymous sign-in failed: ${res.status}`);
  const data = await res.json();
  return {
    idToken: data.idToken,
    refreshToken: data.refreshToken,
    expiresAt: Date.now() + Number(data.expiresIn) * 1000,
    uid: data.localId,
  };
}

async function refreshSession(refreshToken) {
  const res = await fetch(`${TOKEN_BASE}/token?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}`,
  });
  if (!res.ok) throw new Error(`Token refresh failed: ${res.status}`);
  const data = await res.json();
  return {
    idToken: data.id_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + Number(data.expires_in) * 1000,
    uid: data.user_id,
  };
}

async function ensureSession() {
  if (session) return session;
  if (!signInPromise) signInPromise = signInAnonymously().finally(() => { signInPromise = null; });
  session = await signInPromise;
  return session;
}

// Call this right after a Cloud Function reports a successful PIN/password
// check -- that's the moment a new custom claim was just minted on our uid,
// but the ID token we're already holding was issued *before* that claim
// existed. Firestore rules only ever see whatever claims are baked into the
// token presented with each request, so without this refresh the very next
// Firestore read would still look unauthorized.
export async function refreshClaims() {
  const current = await ensureSession();
  session = await refreshSession(current.refreshToken);
}

async function getIdToken() {
  const current = await ensureSession();
  // Refresh a little early (60s of slack) rather than waiting for an
  // in-flight request to get rejected by an already-expired token.
  if (Date.now() > current.expiresAt - 60000) {
    session = await refreshSession(current.refreshToken);
    return session.idToken;
  }
  return current.idToken;
}

// Exposed for firestoreRest.js, which needs to attach this to every
// Firestore REST call too.
export { getIdToken };

// Calls a Cloud Functions "onCall" function directly over HTTP, following
// the same documented request/response shape the Firebase Functions SDK
// uses under the hood ({"data": ...} in, {"result": ...} or {"error": ...}
// out) -- so the server side needs no special-casing for not using that
// SDK on the client.
export async function callFunction(name, data) {
  const idToken = await getIdToken();
  const res = await fetch(`${FUNCTIONS_BASE}/${name}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ data }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.error) {
    const message = (body.error && body.error.message) || `Request failed: ${res.status}`;
    const err = new Error(message);
    err.code = body.error && body.error.status;
    throw err;
  }
  return body.result;
}
