import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

function rosterDocId(course, section) {
  return `${course}_${section}`;
}
function studentDocId(course, section, slug) {
  return `${course}_${section}_${slug}`;
}

export async function loadRoster(course, section) {
  try {
    const snap = await getDoc(doc(db, "rosters", rosterDocId(course, section)));
    return snap.exists() ? snap.data().names || [] : [];
  } catch (e) {
    console.error("Failed to load roster", e);
    return [];
  }
}

export async function saveRoster(course, section, names) {
  try {
    await setDoc(doc(db, "rosters", rosterDocId(course, section)), { names });
  } catch (e) {
    console.error("Failed to save roster", e);
  }
}

export async function loadStudentRaw(course, section, slug) {
  try {
    const snap = await getDoc(doc(db, "students", studentDocId(course, section, slug)));
    return snap.exists() ? snap.data() : null;
  } catch (e) {
    console.error("Failed to load student", e);
    return null;
  }
}

export async function saveStudent(course, section, slug, data) {
  try {
    await setDoc(doc(db, "students", studentDocId(course, section, slug)), data);
  } catch (e) {
    console.error("Failed to save student", e);
  }
}

export async function deleteStudent(course, section, slug) {
  try {
    await deleteDoc(doc(db, "students", studentDocId(course, section, slug)));
  } catch (e) {
    console.error("Failed to delete student", e);
  }
}
