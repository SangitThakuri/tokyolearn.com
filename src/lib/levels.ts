import { LevelInfo } from "./types";

export const levels: LevelInfo[] = [
  {
    level: "absolute-beginner",
    label: "Absolute Beginner",
    description: "Hiragana, katakana, basic greetings, pronunciation",
    kanjiCount: 0,
    vocabCount: 100,
    grammarCount: 0,
    color: "bg-emerald-500",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    level: "n5",
    label: "N5",
    description: "Core grammar, ~800 vocab, ~100 kanji",
    kanjiCount: 103,
    vocabCount: 800,
    grammarCount: 80,
    color: "bg-sky-500",
    gradient: "from-sky-500 to-blue-600",
  },
  {
    level: "n4",
    label: "N4",
    description: "Everyday conversation grammar, ~1500 vocab, ~300 kanji",
    kanjiCount: 300,
    vocabCount: 1500,
    grammarCount: 120,
    color: "bg-violet-500",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    level: "n3",
    label: "N3",
    description: "Intermediate grammar, nuance, ~3750 vocab, ~650 kanji",
    kanjiCount: 650,
    vocabCount: 3750,
    grammarCount: 150,
    color: "bg-amber-500",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    level: "n2",
    label: "N2",
    description: "Business/news-level grammar, ~6000 vocab, ~1000 kanji",
    kanjiCount: 1000,
    vocabCount: 6000,
    grammarCount: 180,
    color: "bg-rose-500",
    gradient: "from-rose-500 to-red-600",
  },
  {
    level: "n1",
    label: "N1",
    description: "Advanced/literary grammar, ~10000+ vocab, ~2000 kanji",
    kanjiCount: 2000,
    vocabCount: 10000,
    grammarCount: 200,
    color: "bg-neutral-800",
    gradient: "from-neutral-800 to-neutral-950",
  },
  {
    level: "pro",
    label: "Pro / Native-level",
    description: "Idioms, keigo, native novels/news, JLPT-independent fluency",
    kanjiCount: 3000,
    vocabCount: 15000,
    grammarCount: 100,
    color: "bg-yellow-600",
    gradient: "from-yellow-600 to-yellow-800",
  },
];

export function getLevelBySlug(slug: string): LevelInfo | undefined {
  return levels.find((l) => l.level === slug);
}
