/** Character counting and JLPT distribution for Japanese text (pure helpers). */

import type { JlptLevel } from "@/types/japanese";

export type JapaneseScript = "kanji" | "hiragana" | "katakana";

export interface ScriptCounts {
  total: number;
  kanji: number;
  hiragana: number;
  katakana: number;
  /** ASCII letters and digits, including hepburn romaji. */
  romaji: number;
  /** Common Japanese and ASCII punctuation marks. */
  punctuation: number;
  /** Characters in kana/kanji ranges, used as the denominator for percentages. */
  japanese: number;
}

export interface JlptLevelStat {
  level: JlptLevel;
  /** Distinct kanji from this level found in the text. */
  unique: number;
  /** Total occurrences of kanji from this level. */
  occurrences: number;
}

export interface TextAnalysis {
  counts: ScriptCounts;
  levels: JlptLevelStat[];
  /** Unique kanji characters found, in first-appearance order. */
  kanjiCharacters: string[];
  /** Characters with no matching kanji in the local datasets. */
  unknownKanji: string[];
}

const CJK_EXTENSION_B_BOUNDARIES: [number, number][] = [
  [0x3400, 0x4dbf],
  [0x20000, 0x2a6df],
  [0x2a700, 0x2ebef],
  [0x2f800, 0x2fa1f],
];

export function isKanji(char: string): boolean {
  const code = char.codePointAt(0) ?? 0;
  if (code >= 0x4e00 && code <= 0x9fff) return true;
  return CJK_EXTENSION_B_BOUNDARIES.some(
    ([start, end]) => code >= start && code <= end,
  );
}

function isHiragana(char: string): boolean {
  const code = char.codePointAt(0) ?? 0;
  return code >= 0x3041 && code <= 0x309f;
}

function isKatakana(char: string): boolean {
  const code = char.codePointAt(0) ?? 0;
  return code >= 0x30a1 && code <= 0x30ff;
}

/** Japanese punctuation plus the ASCII marks commonly pasted with text. */
const PUNCTUATION =
  /[、。，．！？!?,.;:・：「」『』（）()【】［］\[\]｛｝{}—ー～~…・]/;

/**
 * Total characters excludes ASCII whitespace and newline characters so that
 * pasted paragraphs are not dominated by formatting.
 */
export function analyzeText(
  text: string,
  kanjiByLevel: Record<JlptLevel, Set<string>>,
): TextAnalysis {
  const counts: ScriptCounts = {
    total: 0,
    kanji: 0,
    hiragana: 0,
    katakana: 0,
    romaji: 0,
    punctuation: 0,
    japanese: 0,
  };
  const levelOf = new Map<string, JlptLevel>();
  for (const level of Object.keys(kanjiByLevel) as JlptLevel[]) {
    for (const character of kanjiByLevel[level]) {
      if (!levelOf.has(character)) levelOf.set(character, level);
    }
  }

  const occurrences = new Map<JlptLevel, number>();
  const foundKanji = new Set<string>();
  const kanjiCharacters: string[] = [];
  const unknownKanji = new Set<string>();

  for (const char of Array.from(text)) {
    if (/\s/.test(char)) continue;
    counts.total++;

    if (isKanji(char)) {
      counts.kanji++;
      counts.japanese++;
      if (!foundKanji.has(char)) {
        foundKanji.add(char);
        kanjiCharacters.push(char);
      }
      const level = levelOf.get(char);
      if (level) {
        occurrences.set(level, (occurrences.get(level) ?? 0) + 1);
      } else {
        unknownKanji.add(char);
      }
    } else if (isHiragana(char)) {
      counts.hiragana++;
      counts.japanese++;
    } else if (isKatakana(char)) {
      counts.katakana++;
      counts.japanese++;
    } else if (PUNCTUATION.test(char)) {
      counts.punctuation++;
    } else if (/[A-Za-z0-9]/.test(char)) {
      counts.romaji++;
    }
  }

  const levels = (Object.keys(kanjiByLevel) as JlptLevel[]).map((level) => {
    const inLevel = [...foundKanji].filter(
      (character) => levelOf.get(character) === level,
    );
    return {
      level,
      unique: inLevel.length,
      occurrences: occurrences.get(level) ?? 0,
    };
  });

  return {
    counts,
    levels,
    kanjiCharacters,
    unknownKanji: [...unknownKanji],
  };
}

export function percent(part: number, whole: number): number {
  return whole === 0 ? 0 : Math.round((part / whole) * 100);
}
