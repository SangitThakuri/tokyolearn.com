import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LevelExplorer } from "@/components/LevelExplorer";
import {
  kanjiByLevel,
  levelCounts,
  vocabByLevel,
} from "@/lib/data.server";
import {
  LEVEL_META,
  absoluteUrl,
  levelFromSlug,
  levelHref,
  levelSlug,
  practiceHref,
} from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return ["N5", "N4", "N3", "N2", "N1"].map((level) => ({
    level: level.toLowerCase(),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ level: string }>;
}): Promise<Metadata> {
  const { level: slug } = await params;
  const level = levelFromSlug(slug);
  if (!level) return {};

  const counts = levelCounts(level);
  const title = `JLPT ${level} — ${LEVEL_META[level].label} Kanji & Vocabulary`;
  const description = `Browse ${counts.kanji} JLPT ${level} kanji and ${counts.vocab} vocabulary words. Search, filter, study with flashcards, and take a quick quiz — no login required.`;

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(`${levelHref(level)}/`) },
    openGraph: { title, description, url: absoluteUrl(`${levelHref(level)}/`) },
  };
}

export default async function LevelPage({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const { level: slug } = await params;
  const level = levelFromSlug(slug);
  if (!level) notFound();

  const meta = LEVEL_META[level];
  const counts = levelCounts(level);

  const kanji = kanjiByLevel[level].map((item) => ({
    character: item.character,
    strokes: item.strokes,
    meanings: item.meanings,
    onyomi: item.onyomi,
    kunyomi: item.kunyomi,
  }));

  const vocab = vocabByLevel[level].map((item) => ({
    word: item.word,
    reading: item.reading,
    meaning: item.meaning,
    partOfSpeech: item.partOfSpeech,
  }));

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-10 sm:px-8 sm:py-14">
      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-black tracking-widest ${meta.softAccent} ${meta.accent}`}
          >
            JLPT {level}
          </span>
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {levelSlug(level)} · {meta.label}
          </span>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl dark:text-white">
          JLPT {level} kanji & vocabulary
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-slate-700 dark:text-slate-300">
          {meta.description} Study {counts.kanji} kanji and {counts.vocab} words with
          instant search and browser-based drills.
        </p>
      </header>

      <section
        aria-labelledby="practice-heading"
        className="flex flex-col gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6 dark:border-emerald-900 dark:bg-emerald-950/30"
      >
        <div>
          <h2
            id="practice-heading"
            className="text-lg font-bold text-slate-950 dark:text-white"
          >
            Practice JLPT {level}
          </h2>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
            Drill the whole level with saved progress and instant review.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href={practiceHref("flashcards", level)}
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-slate-700 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            Start {level} Flashcards
          </Link>
          <Link
            href={practiceHref("quiz", level)}
            className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            Take {level} Quiz
          </Link>
        </div>
      </section>

      <LevelExplorer
        level={level}
        label={`JLPT ${level}`}
        kanji={kanji}
        vocab={vocab}
      />
    </main>
  );
}
