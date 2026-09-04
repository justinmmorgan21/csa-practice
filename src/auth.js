// Teacher password flows. These used to hash the password in the browser
// and compare it against a hash fetched from Firestore -- meaning the real
// password hash (crackable/overwritable offline) was sent to the browser on
// every visit. All of that now happens server-side in a Cloud Function
// (functions/index.js), which the browser can't read or bypass; this file
// just calls those functions.
import { callFunction, refreshClaims } from "./authClient";

// Used by TeacherGate to decide whether to show "set a password" (first
// run) or "enter your password", without ever reading the password hash
// itself -- firestore.rules blocks that document from clients entirely now.
export async function checkTeacherPasswordExists() {
  const { exists } = await callFunction("checkTeacherPasswordExists", {});
  return exists;
}

// First-run only -- the Cloud Function itself refuses this if a password is
// already set. On success, mints the "teacher" claim, so we refresh the ID
// token before proceeding to anything that needs teacher access.
export async function setInitialTeacherPassword(password) {
  await callFunction("setInitialTeacherPassword", { password });
  await refreshClaims();
}

// Normal unlock. Throws (with a human-readable message) on a wrong password
// or if this record is temporarily locked out from too many recent
// failures -- callers should show err.message to the user.
export async function verifyTeacherPassword(password) {
  await callFunction("verifyTeacherPassword", { password });
  await refreshClaims();
}

// Change password while already unlocked. Requires both the current
// password (re-checked server-side) and the "teacher" claim already being
// active on this session.
export async function changeTeacherPassword(currentPassword, newPassword) {
  await callFunction("changeTeacherPassword", { currentPassword, newPassword });
}
