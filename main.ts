// Office Artifacts: The One-Line Placard Contest — entry program.
// Writes one placard (<=180 chars) to /output/entry.txt: a microwave,
// c. 2009, recast as the ritual reheating vessel of the Lunch Department,
// with the fish offerings banned by edict in 2014. Catalogue voice, one
// concrete office rule everyone recognises, dry to the end. The field is
// full of keyboards and staplers — this label belongs to the microwave.
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// Labelled segments: object + date, material, imagined history. The build
// joins them in catalogue order, so a missing segment breaks the label.
const SEGMENTS = {
  object: "Microwave, c. 2009.",
  material: "Enamelled steel, one dial.",
  history:
    "Ritual reheating vessel of the Lunch Department; offerings of fish were banned by edict in 2014.",
};

function buildPlacard(segments: { object: string; material: string; history: string }): string {
  return [segments.object, segments.material, segments.history]
    .map((part) => part.trim())
    .join(" ");
}

function checkPlacard(text: string): void {
  const trimmed = text.trim();
  if (trimmed.length === 0 || trimmed.length > 180) {
    throw new Error("placard fails the 1-180 character gate");
  }
  if (trimmed.includes("\n")) {
    throw new Error("placard must be a single line");
  }
  // Label craft: a catalogue date, a material, and a provenance detail —
  // the three things that sell the artifact conceit.
  if (!/c\. 2009/.test(trimmed) || !/Enamelled steel/.test(trimmed)) {
    throw new Error("placard must keep its catalogue date and material");
  }
  if (!/banned by edict in 2014/.test(trimmed)) {
    throw new Error("placard must keep its dated prohibition");
  }
  // Modal guard: the field is full of keyboards and staplers.
  if (/keyboard|stapler|lanyard/i.test(trimmed)) {
    throw new Error("placard must avoid the keyboard/stapler modal objects");
  }
}

const PLACARD = buildPlacard(SEGMENTS);
checkPlacard(PLACARD);
const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
mkdirSync(outDir, { recursive: true });
const target = resolve(outDir, "entry.txt");
writeFileSync(target, PLACARD, "utf8");
console.log(`wrote ${PLACARD.length} chars to ${target}`);
