// Packages the normal Vite build output (dist/) into the single-file HTML
// format Apps Script requires, since Apps Script doesn't serve a folder of
// separate files the way GitHub Pages / Firebase Hosting do -- everything
// (JS, CSS, and the PDF worker) gets inlined into one HTML response.
//
// Run this AFTER `npm run build`, e.g.: npm run build && node scripts/build-appsscript.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");
const distAssetsDir = path.join(distDir, "assets");
const outDir = path.join(root, "appsscript-dist");

function findAsset(pattern) {
  const files = fs.readdirSync(distAssetsDir);
  const match = files.find((f) => pattern.test(f));
  if (!match) throw new Error(`Could not find an asset matching ${pattern} in ${distAssetsDir}. Did you run "npm run build" first?`);
  return path.join(distAssetsDir, match);
}

// Locate the built assets.
const jsPath = findAsset(/^index-.*\.js$/);
const cssPath = findAsset(/^index-.*\.css$/);
const workerPath = findAsset(/^pdf\.worker-.*\.mjs$/);

const jsContent = fs.readFileSync(jsPath, "utf8");
const cssContent = fs.readFileSync(cssPath, "utf8");
const workerContent = fs.readFileSync(workerPath, "utf8");

// Prevent the inlined JS from accidentally closing our <script> tag early if
// the literal text "</script" ever appears inside a string in the bundle.
const safeJs = jsContent.replace(/<\/script/gi, "<\\/script");

const workerBase64 = Buffer.from(workerContent, "utf8").toString("base64");

const html = `<!DOCTYPE html>
<html>
<head>
<base target="_top">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AP CSA Adaptive Practice</title>
<style>
${cssContent}
</style>
</head>
<body>
<div id="root"></div>
<script>
window.__PDF_WORKER_SOURCE_B64__ = "${workerBase64}";
</script>
<script type="module">
${safeJs}
</script>
</body>
</html>
`;

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "Index.html"), html);

fs.writeFileSync(
  path.join(outDir, "Code.gs"),
  `function doGet() {\n  return HtmlService.createHtmlOutputFromFile('Index')\n    .setTitle('AP CSA Adaptive Practice')\n    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');\n}\n`
);

fs.writeFileSync(
  path.join(outDir, "appsscript.json"),
  JSON.stringify(
    {
      timeZone: "America/Chicago",
      dependencies: {},
      exceptionLogging: "STACKDRIVER",
      runtimeVersion: "V8",
      webapp: {
        access: "ANYONE",
        executeAs: "USER_DEPLOYING",
      },
    },
    null,
    2
  )
);

const totalSize = html.length;
console.log(`Apps Script bundle written to ${outDir}/`);
console.log(`  Index.html: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`  (JS: ${(jsContent.length / 1024).toFixed(0)} KB, CSS: ${(cssContent.length / 1024).toFixed(0)} KB, worker: ${(workerContent.length / 1024).toFixed(0)} KB)`);
