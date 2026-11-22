/** Dataset loaders and question helpers shared by both study engines. */
import type { JlptLevel, KanjiEntry, VocabEntry } from "@/types/japanese";
import type { QuizType, StudyMode } from "@/types/study";

/** Load every level's kanji once and index characters by JLPT level. */
export async function loadAllKanji(): Promise<Record<JlptLevel, Set<string>>> {
  const levels: JlptLevel[] = ["N5", "N4", "N3", "N2", "N1"];
  const entries = await Promise.all(levels.map((level) => loadKanji(level)));
  return Object.fromEntries(
    levels.map((level, index) => [
      level,
      new Set(entries[index].map((kanji) => kanji.character)),
    ]),
  ) as Record<JlptLevel, Set<string>>;
}

export interface FlashcardExample {
  word: string;
  reading: string;
  meaning: string;
}

export interface Flashcard {
  id: string;
  level: JlptLevel;
  mode: StudyMode;
  front: string;
  reading: string;
  meanings: string[];
  detail: string;
  examples: FlashcardExample[];
}

export interface QuizQuestion {
  id: string;
  type: QuizType;
  prompt: string;
  promptLang: "ja" | "en";
  options: string[];
  answer: string;
  kanji: string;
  meaning: string;
  reading: string;
}

const KANJI_LOADERS: Record<JlptLevel, () => Promise<KanjiEntry[]>> = {
  N5: async () => (await import("../../data/kanji-n5.json")).default as unknown as KanjiEntry[],
  N4: async () => (await import("../../data/kanji-n4.json")).default as unknown as KanjiEntry[],
  N3: async () => (await import("../../data/kanji-n3.json")).default as unknown as KanjiEntry[],
  N2: async () => (await import("../../data/kanji-n2.json")).default as unknown as KanjiEntry[],
  N1: async () => (await import("../../data/kanji-n1.json")).default as unknown as KanjiEntry[],
};

const VOCAB_LOADERS: Record<JlptLevel, () => Promise<VocabEntry[]>> = {
  N5: async () => (await import("../../data/vocab-n5.json")).default as unknown as VocabEntry[],
  N4: async () => (await import("../../data/vocab-n4.json")).default as unknown as VocabEntry[],
  N3: async () => (await import("../../data/vocab-n3.json")).default as unknown as VocabEntry[],
  N2: async () => (await import("../../data/vocab-n2.json")).default as unknown as VocabEntry[],
  N1: async () => (await import("../../data/vocab-n1.json")).default as unknown as VocabEntry[],
};

export function loadKanji(level: JlptLevel): Promise<KanjiEntry[]> {
  return KANJI_LOADERS[level]();
}

/** Lazily load just the selected level's JSON in the browser. */
export async function loadCards(
  level: JlptLevel,
  mode: StudyMode,
): Promise<Flashcard[]> {
  if (mode === "kanji") {
    const entries = await KANJI_LOADERS[level]();
    return entries.map((entry) => ({
      id: `k:${entry.character}`,
      level,
      mode,
      front: entry.character,
      reading: primaryReading(entry),
      meanings: entry.meanings,
      detail: `${entry.strokes} strokes`,
      examples: entry.examples,
    }));
  }

  const entries = await VOCAB_LOADERS[level]();
  return entries.map((entry) => ({
    id: `v:${entry.word}:${entry.reading}`,
    level,
    mode,
    front: entry.word,
    reading: entry.reading,
    meanings: [entry.meaning],
    detail: entry.partOfSpeech,
    examples: [],
  }));
}

export function toHiragana(value: string): string {
  return value
    .replace(/[ァ-ヶ]/g, (char) =>
      String.fromCodePoint((char.codePointAt(0) ?? 0) - 0x60),
    )
    .replace(/[-・.\s]/g, "");
}

/** Prefer a kun'yomi reading so prompts are plain hiragana. */
export function primaryReading(entry: KanjiEntry): string {
  const kun = entry.kunyomi.find((reading) => reading && !/^[-.]+$/.test(reading));
  if (kun) return toHiragana(kun);
  const on = entry.onyomi.find((reading) => Boolean(reading));
  if (on) return toHiragana(on);
  return entry.character;
}

function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function nearby<T>(
  values: T[],
  target: number,
  score: (item: T) => number,
  random: () => number,
): T[] {
  return shuffle(values, random).sort(
    (a, b) => Math.abs(score(a) - target) - Math.abs(score(b) - target),
  );
}

/**
 * Build a quiz using only distractors drawn from the same JLPT level.
 * Reading options favour similar lengths; kanji options favour similar
 * stroke counts or meaning lengths so wrong answers stay plausible.
 */
export function buildQuiz(
  pool: readonly KanjiEntry[],
  type: QuizType,
  count: number,
  random: () => number = Math.random,
): QuizQuestion[] {
  const eligible = pool.filter((entry) => {
    if (type === "kanjiToReading") {
      return primaryReading(entry) !== entry.character;
    }
    if (type === "meaningToKanji") {
      return (entry.meanings[0]?.length ?? 0) > 1;
    }
    return true;
  });

  return shuffle(eligible, random).slice(0, count).map((target, index) => {
    const answer =
      type === "kanjiToReading"
        ? primaryReading(target)
        : target.character;
    const targetReading = primaryReading(target);
    const targetMeaning = target.meanings[0] ?? "";

    let distractors: string[];
    if (type === "kanjiToReading") {
      const candidates = pool
        .map((entry) => primaryReading(entry))
        .filter(
          (reading) =>
            reading !== answer && reading !== target.character && Boolean(reading),
        );
      distractors = nearby(
        candidates,
        [...answer].length,
        (reading) => [...reading].length,
        random,
      ).filter((reading, position, values) => values.indexOf(reading) === position);
      distractors = distractors.slice(0, 3);
    } else {
      const candidates = pool.filter(
        (entry) =>
          entry.character !== target.character &&
          (type !== "meaningToKanji" ||
            (entry.meanings[0] ?? "") !== targetMeaning),
      );
      const ranked = nearby(
        candidates,
        type === "readingToKanji"
          ? target.strokes
          : [...targetMeaning].length,
        (entry) =>
          type === "readingToKanji"
            ? entry.strokes
            : [...(entry.meanings[0] ?? "")].length,
        random,
      );
      distractors = ranked.slice(0, 3).map((entry) => entry.character);
    }

    const options = shuffle([answer, ...new Set(distractors)], random);
    const prompt =
      type === "meaningToKanji"
        ? targetMeaning
        : type === "readingToKanji"
          ? targetReading
          : target.character;

    return {
      id: `q${index}-${target.character}`,
      type,
      prompt,
      promptLang: type === "meaningToKanji" ? "en" : "ja",
      options,
      answer,
      kanji: target.character,
      meaning: targetMeaning,
      reading: targetReading,
    };
  });
}
