/**
 * Runtime + type-level verification of the generated /data JSON files.
 * The interfaces in src/types/japanese.ts are the source of truth.
 *
 * Run with: npm run verify:data
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type {
  JlptLevel,
  KanjiDataset,
  KanjiEntry,
  VocabDataset,
  VocabEntry,
} from "../src/types/japanese";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LEVELS: readonly JlptLevel[] = ["N5", "N4", "N3", "N2", "N1"];

function readJson(relativePath: string): unknown {
  return JSON.parse(readFileSync(path.join(ROOT, relativePath), "utf8"));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function assertKanjiDataset(value: unknown, level: JlptLevel): asserts value is KanjiDataset {
  if (!Array.isArray(value)) {
    throw new Error(`kanji-${level.toLowerCase()}.json is not an array`);
  }

  value.forEach((raw, index) => {
    const where = `kanji-${level.toLowerCase()}[${index}]`;
    if (!isRecord(raw)) throw new Error(`${where} is not an object`);
    if (typeof raw.character !== "string" || raw.character.length === 0) {
      throw new Error(`${where}.character must be a non-empty string`);
    }
    if (raw.jlpt !== level) throw new Error(`${where}.jlpt must be ${level}`);
    if (typeof raw.strokes !== "number" || raw.strokes < 0) {
      throw new Error(`${where}.strokes must be a non-negative number`);
    }
    for (const key of ["onyomi", "kunyomi", "meanings", "radicals"] as const) {
      if (!isStringArray(raw[key])) {
        throw new Error(`${where}.${key} must be a string array`);
      }
    }
    if (!Array.isArray(raw.examples) || raw.examples.length !== 3) {
      throw new Error(`${where}.examples must contain exactly 3 examples`);
    }
    raw.examples.forEach((example, exampleIndex) => {
      if (!isRecord(example)) {
        throw new Error(`${where}.examples[${exampleIndex}] is not an object`);
      }
      for (const key of ["word", "reading", "meaning"] as const) {
        if (typeof example[key] !== "string" || example[key].length === 0) {
          throw new Error(
            `${where}.examples[${exampleIndex}].${key} must be a non-empty string`,
          );
        }
      }
    });
  });
}

function assertVocabDataset(value: unknown, level: JlptLevel): asserts value is VocabDataset {
  if (!Array.isArray(value)) {
    throw new Error(`vocab-${level.toLowerCase()}.json is not an array`);
  }

  value.forEach((raw, index) => {
    const where = `vocab-${level.toLowerCase()}[${index}]`;
    if (!isRecord(raw)) throw new Error(`${where} is not an object`);
    for (const key of ["word", "reading", "meaning", "partOfSpeech"] as const) {
      if (typeof raw[key] !== "string" || raw[key].length === 0) {
        throw new Error(`${where}.${key} must be a non-empty string`);
      }
    }
    if (raw.jlpt !== level) throw new Error(`${where}.jlpt must be ${level}`);
  });
}

let kanjiTotal = 0;
let vocabTotal = 0;

for (const level of LEVELS) {
  const suffix = level.toLowerCase();
  const rawKanji = readJson(`data/kanji-${suffix}.json`);
  const rawVocab = readJson(`data/vocab-${suffix}.json`);

  assertKanjiDataset(rawKanji, level);
  assertVocabDataset(rawVocab, level);

  // Compile-time proof that the verified values satisfy the shared interfaces.
  const kanji: KanjiDataset = rawKanji;
  const vocab: VocabDataset = rawVocab;
  const firstKanji: KanjiEntry | undefined = kanji[0];
  const firstVocab: VocabEntry | undefined = vocab[0];

  if (!firstKanji || !firstVocab) {
    throw new Error(`${level} datasets must not be empty`);
  }

  kanjiTotal += kanji.length;
  vocabTotal += vocab.length;
  console.log(
    `${level}: ${kanji.length} kanji, ${vocab.length} vocab — schema OK`,
  );
}

console.log(`Verified ${kanjiTotal} kanji and ${vocabTotal} vocabulary entries.`);
