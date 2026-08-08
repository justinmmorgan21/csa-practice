import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

// SHA-256 hash using the browser's built-in Web Crypto API -- no extra
// library needed, and the plain password is never stored anywhere.
export async function hashPassword(str) {
  const enc = new TextEncoder().encode(str);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function loadTeacherPasswordHash() {
  try {
    const snap = await getDoc(doc(db, "settings", "teacher"));
    return snap.exists() ? snap.data().passwordHash : null;
  } catch (e) {
    console.error("Failed to load teacher password", e);
    return null;
  }
}

export async function saveTeacherPasswordHash(hash) {
  try {
    await setDoc(doc(db, "settings", "teacher"), { passwordHash: hash });
  } catch (e) {
    console.error("Failed to save teacher password", e);
  }
}
