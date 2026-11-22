/** Shared schema for the static JSON datasets in /data. */

export type JlptLevel = "N5" | "N4" | "N3" | "N2" | "N1";

export const JLPT_LEVELS: readonly JlptLevel[] = ["N5", "N4", "N3", "N2", "N1"];

export interface KanjiExample {
  /** A word that uses the kanji. */
  word: string;
  /** Kana reading of the word. */
  reading: string;
  /** Short English gloss of the word. */
  meaning: string;
}

export interface KanjiEntry {
  character: string;
  jlpt: JlptLevel;
  strokes: number;
  onyomi: string[];
  kunyomi: string[];
  meanings: string[];
  radicals: string[];
  /** Exactly three short example words, as required by the dataset contract. */
  examples: [KanjiExample, KanjiExample, KanjiExample];
}

export interface VocabEntry {
  word: string;
  reading: string;
  meaning: string;
  jlpt: JlptLevel;
  /** Human-readable part(s) of speech, e.g. "noun, ichidan verb". */
  partOfSpeech: string;
}

export type KanjiDataset = KanjiEntry[];
export type VocabDataset = VocabEntry[];
