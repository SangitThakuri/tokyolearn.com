import Link from "next/link";
import { DailyKanjiSpotlight } from "@/components/DailyKanjiSpotlight";
import { levelCounts, spotlightKanji } from "@/lib/data.server";
import { LEVELS, LEVEL_META, levelHref, practiceHref } from "@/lib/site";

const tools = [
  {
    title: "Past-paper practice",
    description: "Original N5–N1 exam papers with bilingual answer explanations.",
    href: "/exams/",
    cta: "Browse exam bank",
  },
  {
    title: "Kanji & vocabulary grids",
    description: "Search, filter, and open any item from a level.",
    href: "/jlpt/n5#explorer",
    cta: "Browse N5 grid",
  },
  {
    title: "Flashcards",
    description: "Flip words to reveal readings, meanings, and parts of speech.",
    href: practiceHref("flashcards", "N5"),
    cta: "Start flashcards",
  },
  {
    title: "Quick quiz",
    description: "Answer multiple-choice questions built from the same lists.",
    href: practiceHref("quiz", "N5"),
    cta: "Take a quiz",
  },
  {
    title: "Text analyzer",
    description: "See the script mix and JLPT kanji levels in any Japanese text.",
    href: "/tools/text-analyzer/",
    cta: "Analyze text",
  },
  {
    title: "Kana converter",
    description: "Convert romaji, hiragana, and katakana instantly.",
    href: "/tools/kana-converter/",
    cta: "Convert kana",
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-5 py-12 sm:px-8 sm:py-16">
      <section className="flex flex-col gap-6">
        <p className="text-sm font-bold tracking-[0.2em] text-emerald-700 uppercase dark:text-emerald-400">
          <span lang="ja">日本語を学ぼう</span> · Learn Japanese
        </p>
        <h1 className="max-w-3xl text-5xl leading-[1.05] font-black tracking-tight text-slate-950 sm:text-7xl dark:text-white">
          Japanese study that stays out of your way.
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-slate-700 sm:text-xl dark:text-slate-300">
          TokyoLearn gives you clean kanji and vocabulary lists for{" "}
          <span className="font-bold text-slate-950 dark:text-white">JLPT N5 through N1</span>
          , plus focused drills. No account, no ads, no server — everything loads as
          static pages and your progress stays in your browser.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={levelHref("N5")}
            className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            Start with N5 →
          </Link>
          <Link
            href="/jlpt/n5#explorer"
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-800 transition-colors hover:border-emerald-600 dark:border-slate-700 dark:text-slate-200"
          >
            Explore the data
          </Link>
        </div>
      </section>

      <DailyKanjiSpotlight candidates={spotlightKanji} />

      <section aria-labelledby="quick-start-heading" className="flex flex-col gap-6">
        <div>
          <h2
            id="quick-start-heading"
            className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white"
          >
            Quick start by level
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Each level has its own searchable hub, flashcards, and quiz.
          </p>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LEVELS.map((level) => {
            const meta = LEVEL_META[level];
            const counts = levelCounts(level);
            return (
              <li key={level}>
                <Link
                  href={levelHref(level)}
                  className={`flex h-full flex-col gap-2 rounded-2xl border p-5 transition-colors hover:border-current ${meta.softAccent}`}
                >
                  <span className={`text-xs font-black tracking-widest ${meta.accent}`}>
                    {level}
                  </span>
                  <span className="text-xl font-bold text-slate-950 dark:text-white">
                    {meta.label}
                  </span>
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {meta.description}
                  </span>
                  <span className="mt-auto pt-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                    {counts.kanji} kanji · {counts.vocab} words
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="tools-heading" className="flex flex-col gap-6">
        <h2
          id="tools-heading"
          className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white"
        >
          Study tools
        </h2>
        <ul className="grid gap-3 sm:grid-cols-3">
          {tools.map((tool) => (
            <li
              key={tool.title}
              className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <h3 className="text-base font-bold text-slate-950 dark:text-white">
                {tool.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{tool.description}</p>
              <Link
                href={tool.href}
                className="mt-auto pt-2 text-sm font-bold text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-400"
              >
                {tool.cta} →
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
