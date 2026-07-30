export interface LevelProgress {
  completedGrammar: string[];
  completedVocab: string[];
  completedKanji: string[];
}

export interface ProgressData {
  levels: Record<string, LevelProgress>;
}

const STORAGE_KEY = "tokyolearn-progress";

function getStored(): ProgressData {
  if (typeof window === "undefined") return { levels: {} };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { levels: {} };
  } catch {
    return { levels: {} };
  }
}

function store(data: ProgressData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getProgress(): ProgressData {
  return getStored();
}

export function setProgress(data: ProgressData): void {
  store(data);
}

export function markCompleted(
  level: string,
  type: "grammar" | "vocab" | "kanji",
  id: string,
): void {
  const data = getStored();
  if (!data.levels[level]) {
    data.levels[level] = {
      completedGrammar: [],
      completedVocab: [],
      completedKanji: [],
    };
  }
  const key =
    type === "grammar"
      ? "completedGrammar"
      : type === "vocab"
        ? "completedVocab"
        : "completedKanji";
  const arr = data.levels[level][key];
  if (!arr.includes(id)) arr.push(id);
  store(data);
}

export function getCompletionPercentage(
  level: string,
  total: { grammar: number; vocab: number; kanji: number },
): number {
  const data = getStored();
  const prog = data.levels[level];
  if (!prog) return 0;
  const done =
    prog.completedGrammar.length +
    prog.completedVocab.length +
    prog.completedKanji.length;
  const tot = total.grammar + total.vocab + total.kanji;
  if (tot === 0) return 0;
  return Math.round((done / tot) * 100);
}
