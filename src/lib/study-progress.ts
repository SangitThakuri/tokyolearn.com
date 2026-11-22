/**
 * Zero-login progress persistence. All state lives in namespaced localStorage
 * keys and is exposed through useSyncExternalStore-compatible snapshots so
 * server rendering always sees a stable empty value.
 */
import type { JlptLevel } from "@/types/japanese";
import type { QuestionCount, QuizType, Rating, StudyMode } from "@/types/study";

const STORAGE_KEY = "tokyolearn:progress:v1";
const CHANGE_EVENT = "tokyolearn:progresschange";

export interface DeckProgress {
  ratings: Record<string, Rating>;
  reviewed: number;
}

export interface QuizResult {
  level: JlptLevel;
  type: QuizType;
  count: QuestionCount;
  correct: number;
  bestStreak: number;
  date: number;
}

export interface StudyProgress {
  flashcards: Record<string, DeckProgress>;
  quizBest: Record<string, number>;
  quizHistory: QuizResult[];
}

export const EMPTY_PROGRESS: StudyProgress = {
  flashcards: {},
  quizBest: {},
  quizHistory: [],
};

const VALID_RATINGS: readonly Rating[] = ["again", "good", "mastered"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parse(raw: string | null): StudyProgress {
  if (!raw) return EMPTY_PROGRESS;
  try {
    const value = JSON.parse(raw) as Partial<StudyProgress>;
    const flashcards: StudyProgress["flashcards"] = {};
    if (isRecord(value.flashcards)) {
      for (const [key, entry] of Object.entries(value.flashcards)) {
        if (!isRecord(entry) || !isRecord(entry.ratings)) continue;
        const ratings: Record<string, Rating> = {};
        for (const [id, rating] of Object.entries(entry.ratings)) {
          if (VALID_RATINGS.includes(rating as Rating)) ratings[id] = rating as Rating;
        }
        flashcards[key] = {
          ratings,
          reviewed: typeof entry.reviewed === "number" ? entry.reviewed : 0,
        };
      }
    }
    const quizBest: StudyProgress["quizBest"] = {};
    if (isRecord(value.quizBest)) {
      for (const [key, score] of Object.entries(value.quizBest)) {
        if (typeof score === "number") quizBest[key] = score;
      }
    }
    const quizHistory = Array.isArray(value.quizHistory)
      ? (value.quizHistory.filter(isRecord).slice(0, 10) as unknown as QuizResult[])
      : [];
    return { flashcards, quizBest, quizHistory };
  } catch {
    return EMPTY_PROGRESS;
  }
}

let cached: StudyProgress | null = null;

export function getProgressSnapshot(): StudyProgress {
  if (typeof window === "undefined") return EMPTY_PROGRESS;
  if (!cached) {
    try {
      cached = parse(window.localStorage.getItem(STORAGE_KEY));
    } catch {
      cached = EMPTY_PROGRESS;
    }
  }
  return cached;
}

export function getServerProgressSnapshot(): StudyProgress {
  return EMPTY_PROGRESS;
}

export function subscribeProgress(onChange: () => void): () => void {
  function onStorage(event: StorageEvent) {
    if (event.key === STORAGE_KEY) {
      cached = null;
      onChange();
    }
  }

  if (typeof window !== "undefined") {
    window.addEventListener(CHANGE_EVENT, onChange);
    window.addEventListener("storage", onStorage);
  }
  return () => {
    if (typeof window === "undefined") return;
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function persist(next: StudyProgress): void {
  cached = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage can be unavailable (private mode, quota); keep in-memory state.
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }
}

export function deckKey(level: JlptLevel, mode: StudyMode): string {
  return `${mode}:${level}`;
}

export function recordRating(
  level: JlptLevel,
  mode: StudyMode,
  cardId: string,
  rating: Rating,
): void {
  const current = getProgressSnapshot();
  const key = deckKey(level, mode);
  const deck = current.flashcards[key] ?? { ratings: {}, reviewed: 0 };
  persist({
    ...current,
    flashcards: {
      ...current.flashcards,
      [key]: {
        ratings: { ...deck.ratings, [cardId]: rating },
        reviewed: deck.reviewed + 1,
      },
    },
  });
}

export function resetDeck(level: JlptLevel, mode: StudyMode): void {
  const current = getProgressSnapshot();
  const flashcards = { ...current.flashcards };
  delete flashcards[deckKey(level, mode)];
  persist({ ...current, flashcards });
}

export function quizResultKey(
  level: JlptLevel,
  type: QuizType,
  count: QuestionCount,
): string {
  return `${level}:${type}:${count}`;
}

export function recordQuizResult(result: QuizResult): void {
  const current = getProgressSnapshot();
  const key = quizResultKey(result.level, result.type, result.count);
  const previousBest = current.quizBest[key] ?? 0;
  persist({
    ...current,
    quizBest: {
      ...current.quizBest,
      [key]: Math.max(previousBest, result.correct),
    },
    quizHistory: [result, ...current.quizHistory].slice(0, 10),
  });
}

export interface MasteryStats {
  percent: number;
  mastered: number;
  good: number;
  again: number;
  untouched: number;
}

/** Again = 0%, Good = 50%, Mastered = 100% of a card's mastery. */
export function masteryStats(
  cardIds: readonly string[],
  ratings: Record<string, Rating>,
): MasteryStats {
  let mastered = 0;
  let good = 0;
  let again = 0;

  for (const id of cardIds) {
    const rating = ratings[id];
    if (rating === "mastered") mastered++;
    else if (rating === "good") good++;
    else if (rating === "again") again++;
  }

  const total = cardIds.length;
  return {
    percent: total === 0 ? 0 : Math.round(((mastered + good * 0.5) / total) * 100),
    mastered,
    good,
    again,
    untouched: Math.max(0, total - mastered - good - again),
  };
}
