import { restGetDoc, restSetDoc, restDeleteDoc } from "./firestoreRest";

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

export async function loadStudentRaw(course, section, slug) {
  return await restGetDoc("students", studentDocId(course, section, slug));
}

export async function saveStudent(course, section, slug, data) {
  await restSetDoc("students", studentDocId(course, section, slug), data);
}

export async function deleteStudent(course, section, slug) {
  await restDeleteDoc("students", studentDocId(course, section, slug));
}
