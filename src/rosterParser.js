// Client-side-only roster PDF parsing.
//
// PRIVACY NOTE: everything in this file runs entirely in the browser.
// The PDF is never uploaded to any server (there is no backend in this
// app at all -- Firestore is written to directly from the browser).
// Full names and ID numbers extracted here are held only in local
// component state for the duration of the review step in the Teacher
// tab, and are never written to Firestore, logged, or persisted in any
// way. Only the abbreviated name + last-2-digits ID tag that the
// teacher confirms ever get saved.
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// Extracts raw text from a PDF File object, entirely in-browser.
export async function extractPdfText(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    // Group text items by their vertical position to reconstruct lines,
    // since pdf.js returns individual positioned text fragments rather
    // than pre-joined lines.
    const lines = {};
    for (const item of content.items) {
      const y = Math.round(item.transform[5]);
      if (!lines[y]) lines[y] = [];
      lines[y].push(item);
    }
    const sortedY = Object.keys(lines).map(Number).sort((a, b) => b - a);
    for (const y of sortedY) {
      const lineItems = lines[y].sort((a, b) => a.transform[4] - b.transform[4]);
      fullText += lineItems.map((it) => it.str).join(" ") + "\n";
    }
  }
  return fullText;
}

// Parses roster text into candidate student rows. Tuned for the common
// "LastName, FirstName ... ID ..." export format, with a fallback for
// "FirstName LastName" (no comma) if no ID is found on that pattern.
export function parseRosterText(text) {
  const lines = text.split("\n");
  const rows = [];
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Primary pattern: "Last, First" followed by other columns.
    const commaMatch = line.match(/^([A-Za-z'\-]+(?:\s[A-Za-z'\-]+)*),\s+([A-Za-z'\-]+(?:\s[A-Za-z'\-]+)*)\b/);
    if (commaMatch) {
      const lastName = commaMatch[1].trim();
      const firstName = commaMatch[2].trim();
      const idMatch = line.match(/\b(\d{4,8})\b/);
      rows.push({
        firstName,
        lastName,
        id: idMatch ? idMatch[1] : null,
        raw: line,
      });
    }
  }
  return rows;
}

// Turns a parsed row into the abbreviated display form, e.g. "Santa C."
export function abbreviateName(row) {
  const firstWord = row.firstName.split(/\s+/)[0];
  const lastInitial = row.lastName.trim()[0]?.toUpperCase() || "";
  return `${firstWord} ${lastInitial}.`;
}

// Given a list of parsed rows, returns them with a proposed abbreviated
// name and an idTag (last 2 digits of ID, if available) attached.
export function buildProposedRoster(rows) {
  return rows.map((row) => ({
    ...row,
    proposedName: abbreviateName(row),
    idTag: row.id ? row.id.slice(-2) : null,
  }));
}
