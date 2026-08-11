// Combines every unit's item file into one bank. When a new unit's
// questions are ready, add an import + spread it in below -- nothing
// else in the app needs to change.
import { UNIT1_SEGMENT_A_ITEMS } from "./unit1-segmentA";
import { UNIT1_SEGMENT_B_ITEMS } from "./unit1-segmentB";
import { UNIT1_SEGMENT_C_ITEMS } from "./unit1-segmentC";

export const ITEM_BANK = [
  ...UNIT1_SEGMENT_A_ITEMS,
  ...UNIT1_SEGMENT_B_ITEMS,
  ...UNIT1_SEGMENT_C_ITEMS,
  // ...UNIT2_ITEMS,  <- add future units here
];
