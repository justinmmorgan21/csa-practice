// A minimal Firestore REST client -- used instead of the Firebase SDK,
// since the SDK's internals fail inside Google Apps Script's sandboxed web
// app iframe (reporting "client is offline" even though the network is
// fine), while plain fetch() calls to the same REST API work correctly
// there. This also works identically on normal hosting (Firebase Hosting /
// GitHub Pages), so it's a single implementation for every target, not an
// Apps-Script-only workaround.
//
// Our Firestore security rules are "allow read, write: if true" for every
// collection this app uses, so these calls are unauthenticated, matching
// how the app already behaves.
import { PROJECT_ID } from "./firebase";

const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// --- Convert plain JS values <-> Firestore's REST "Value" wire format ---
function toFirestoreValue(value) {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === "string") return { stringValue: value };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") {
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(toFirestoreValue) } };
  }
  if (typeof value === "object") {
    const fields = {};
    for (const key of Object.keys(value)) fields[key] = toFirestoreValue(value[key]);
    return { mapValue: { fields } };
  }
  return { nullValue: null };
}

function fromFirestoreValue(fv) {
  if (!fv) return null;
  if ("nullValue" in fv) return null;
  if ("stringValue" in fv) return fv.stringValue;
  if ("booleanValue" in fv) return fv.booleanValue;
  if ("integerValue" in fv) return parseInt(fv.integerValue, 10);
  if ("doubleValue" in fv) return fv.doubleValue;
  if ("arrayValue" in fv) return (fv.arrayValue.values || []).map(fromFirestoreValue);
  if ("mapValue" in fv) {
    const obj = {};
    const fields = fv.mapValue.fields || {};
    for (const key of Object.keys(fields)) obj[key] = fromFirestoreValue(fields[key]);
    return obj;
  }
  return null;
}

function objToFields(obj) {
  const fields = {};
  for (const key of Object.keys(obj)) fields[key] = toFirestoreValue(obj[key]);
  return fields;
}

function fieldsToObj(fields) {
  const obj = {};
  for (const key of Object.keys(fields || {})) obj[key] = fromFirestoreValue(fields[key]);
  return obj;
}

// --- Public API, matching the shape of the SDK calls we used before ---
export async function restGetDoc(collection, id) {
  try {
    const res = await fetch(`${BASE}/${collection}/${encodeURIComponent(id)}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Firestore GET failed: ${res.status}`);
    const data = await res.json();
    return fieldsToObj(data.fields);
  } catch (e) {
    console.error(`restGetDoc(${collection}/${id}) failed`, e);
    return null;
  }
}

// PATCH with no updateMask fully replaces the document's fields, matching
// the "always write the whole object" pattern this app already uses.
export async function restSetDoc(collection, id, obj) {
  try {
    const res = await fetch(`${BASE}/${collection}/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields: objToFields(obj) }),
    });
    if (!res.ok) throw new Error(`Firestore PATCH failed: ${res.status}`);
  } catch (e) {
    console.error(`restSetDoc(${collection}/${id}) failed`, e);
  }
}

export async function restDeleteDoc(collection, id) {
  try {
    await fetch(`${BASE}/${collection}/${encodeURIComponent(id)}`, { method: "DELETE" });
  } catch (e) {
    console.error(`restDeleteDoc(${collection}/${id}) failed`, e);
  }
}
