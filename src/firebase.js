// -----------------------------------------------------------------------
// Firebase project ID. Set via the VITE_FIREBASE_PROJECT_ID environment
// variable at build time (see .env, or the GitHub Actions secret of the
// same name) -- this replaces the old manual find-and-replace approach,
// which was error-prone (easy to accidentally deploy with the placeholder
// still in place). Falls back to a placeholder only if the env var is
// missing, so a misconfigured build fails obviously rather than silently.
//
// Note: we no longer initialize the Firebase SDK here. All Firestore access
// goes through firestoreRest.js instead (plain REST calls), since the SDK's
// internals fail inside Google Apps Script's sandboxed web app iframe. This
// also means the app no longer depends on the "firebase" npm package at all.
// -----------------------------------------------------------------------
export const PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID || "MISSING_VITE_FIREBASE_PROJECT_ID";
