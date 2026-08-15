import { restGetDoc, restSetDoc } from "./firestoreRest";

// SHA-256 hash using the browser's built-in Web Crypto API -- no extra
// library needed, and the plain password is never stored anywhere.
export async function hashPassword(str) {
  const enc = new TextEncoder().encode(str);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function loadTeacherPasswordHash() {
  const data = await restGetDoc("settings", "teacher");
  return data ? data.passwordHash : null;
}

export async function saveTeacherPasswordHash(hash) {
  await restSetDoc("settings", "teacher", { passwordHash: hash });
}
