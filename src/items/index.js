// Combines every unit's item file into one bank. When a new unit's
// questions are ready, add an import + spread it in below -- nothing
// else in the app needs to change.
import { UNIT1_SEGMENT_A_ITEMS } from "./unit1-segmentA";
import { UNIT1_SEGMENT_B_ITEMS } from "./unit1-segmentB";
import { UNIT1_SEGMENT_C_ITEMS } from "./unit1-segmentC";
import { UNIT2_SEGMENT_A_ITEMS } from "./unit2-segmentA";
import { UNIT2_SEGMENT_B_ITEMS } from "./unit2-segmentB";
import { UNIT3_SEGMENT_A_ITEMS } from "./unit3-segmentA";

// This is the seed/fallback content -- the live, editable version now lives
// in Firestore (see contentStore.js). This static bank is only used to
// auto-seed Firestore the first time each segment is loaded, and as the
// data source if we ever need to revert away from the live-editing setup.
export const STATIC_ITEM_BANK = [
  ...UNIT1_SEGMENT_A_ITEMS,
  ...UNIT1_SEGMENT_B_ITEMS,
  ...UNIT1_SEGMENT_C_ITEMS,
  ...UNIT2_SEGMENT_A_ITEMS,
  ...UNIT2_SEGMENT_B_ITEMS,
  ...UNIT3_SEGMENT_A_ITEMS,
  // ...UNIT3_SEGMENT_B_ITEMS,  <- add once topics 3.5-3.9 are generated
];
