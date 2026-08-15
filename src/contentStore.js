import { restGetDoc, restSetDoc } from "./firestoreRest";
import { STATIC_ITEM_BANK } from "./items";

function segmentDocId(course, unitId, segmentId) {
  return `${course}_${unitId}_${segmentId}`;
}

// Loads one segment's items from Firestore. If that segment has never been
// saved to Firestore yet, seeds it from the static bank (scoped to that
// segment's topics) and writes it in, so it only ever needs to happen once.
async function loadSegmentItems(course, unitId, segmentId, segmentTopics) {
  const data = await restGetDoc("content", segmentDocId(course, unitId, segmentId));
  if (data) return data.items || [];
  const seed = STATIC_ITEM_BANK.filter((it) => it.course === course && segmentTopics.includes(it.topic));
  await restSetDoc("content", segmentDocId(course, unitId, segmentId), { items: seed });
  return seed;
}

export async function saveSegmentItems(course, unitId, segmentId, items) {
  await restSetDoc("content", segmentDocId(course, unitId, segmentId), { items });
}

// Loads every segment's items for a course and combines them into one flat
// array -- this becomes the live, in-memory item bank for that course.
// unitsForCourse is the UNITS[course] array from App.jsx's structure config.
export async function loadAllContent(unitsForCourse, course) {
  let all = [];
  for (const unit of unitsForCourse || []) {
    for (const seg of unit.segments) {
      const items = await loadSegmentItems(course, unit.id, seg.id, seg.topics);
      all = all.concat(items);
    }
  }
  return all;
}
