import { restGetDoc, restSetDoc, restDeleteDoc } from "./firestoreRest";
import { callFunction, refreshClaims } from "./authClient";

function rosterDocId(course, section) {
  return `${course}_${section}`;
}
function studentDocId(course, section, slug) {
  return `${course}_${section}_${slug}`;
}

export async function loadRoster(course, section) {
  const data = await restGetDoc("rosters", rosterDocId(course, section));
  return data ? data.names || [] : [];
}

export async function saveRoster(course, section, names) {
  await restSetDoc("rosters", rosterDocId(course, section), { names });
}

// Checks a student's PIN server-side (Cloud Function, using the Admin SDK --
// the browser never sees the real stored PIN, before or after this call).
// On success it mints a "student" claim scoped to this exact record, so we
// refresh the ID token before the caller goes on to read/write it via
// loadStudentRaw/saveStudent below. Throws (with a human-readable message)
// on a wrong PIN or a temporary lockout from too many recent failures.
export async function verifyStudentPin(course, section, slug, pin, displayName, idTag) {
  await callFunction("verifyStudentPin", { course, section, slug, pin, displayName, idTag });
  await refreshClaims();
}

export async function loadStudentRaw(course, section, slug) {
  return await restGetDoc("students", studentDocId(course, section, slug));
}

export async function saveStudent(course, section, slug, data) {
  await restSetDoc("students", studentDocId(course, section, slug), data);
}

export async function deleteStudent(course, section, slug) {
  await restDeleteDoc("students", studentDocId(course, section, slug));
}
