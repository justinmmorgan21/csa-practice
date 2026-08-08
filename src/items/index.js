// Combines every unit's item file into one bank. When a new unit's
// questions are ready, add an import + spread it in below -- nothing
// else in the app needs to change.
import { UNIT1_ITEMS } from "./unit1";

export const ITEM_BANK = [
  ...UNIT1_ITEMS,
  // ...UNIT2_ITEMS,  <- add future units here
];
