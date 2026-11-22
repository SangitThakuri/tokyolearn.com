/**
 * Server-only dataset access. Importing this module pulls in the generated JSON,
 * so it must never be imported from a Client Component.
 */
import type {
  JlptLevel,
  KanjiEntry,
  VocabEntry,
} from "@/types/japanese";
import { LEVELS } from "@/lib/site";

import kanjiN5 from "../../data/kanji-n5.json";
import kanjiN4 from "../../data/kanji-n4.json";
import kanjiN3 from "../../data/kanji-n3.json";
import kanjiN2 from "../../data/kanji-n2.json";
import kanjiN1 from "../../data/kanji-n1.json";
import vocabN5 from "../../data/vocab-n5.json";
import vocabN4 from "../../data/vocab-n4.json";
import vocabN3 from "../../data/vocab-n3.json";
import vocabN2 from "../../data/vocab-n2.json";
import vocabN1 from "../../data/vocab-n1.json";

export const kanjiByLevel: Record<JlptLevel, KanjiEntry[]> = {
  N5: kanjiN5 as unknown as KanjiEntry[],
  N4: kanjiN4 as unknown as KanjiEntry[],
  N3: kanjiN3 as unknown as KanjiEntry[],
  N2: kanjiN2 as unknown as KanjiEntry[],
  N1: kanjiN1 as unknown as KanjiEntry[],
};

export const vocabByLevel: Record<JlptLevel, VocabEntry[]> = {
  N5: vocabN5 as unknown as VocabEntry[],
  N4: vocabN4 as unknown as VocabEntry[],
  N3: vocabN3 as unknown as VocabEntry[],
  N2: vocabN2 as unknown as VocabEntry[],
  N1: vocabN1 as unknown as VocabEntry[],
};

export const allKanji: KanjiEntry[] = LEVELS.flatMap((level) => kanjiByLevel[level]);
export const allVocab: VocabEntry[] = LEVELS.flatMap((level) => vocabByLevel[level]);

const kanjiLookup = new Map(allKanji.map((kanji) => [kanji.character, kanji]));

export function getKanji(character: string): KanjiEntry | undefined {
  return kanjiLookup.get(character);
}

export function getKanjiNeighbors(character: string): {
  previous?: KanjiEntry;
  next?: KanjiEntry;
} {
  const index = allKanji.findIndex((kanji) => kanji.character === character);
  if (index < 0) return {};
  return {
    previous: index > 0 ? allKanji[index - 1] : undefined,
    next: index < allKanji.length - 1 ? allKanji[index + 1] : undefined,
  };
}

export function levelCounts(level: JlptLevel): { kanji: number; vocab: number } {
  return {
    kanji: kanjiByLevel[level].length,
    vocab: vocabByLevel[level].length,
  };
}

/** Small, representative set used by the home-page daily spotlight. */
export const spotlightKanji: KanjiEntry[] = kanjiByLevel.N5.slice(0, 24);
