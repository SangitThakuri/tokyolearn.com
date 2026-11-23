import Link from "next/link";
import { KanjiPreviewCard } from "@/components/KanjiPreviewCard";
import { levelCounts, previewKanji } from "@/lib/data.server";
import { LEVELS, LEVEL_META, levelHref, practiceHref } from "@/lib/site";

const levelTotals = LEVELS.reduce(
  (totals, level) => {
    const counts = levelCounts(level);
    return {
      kanji: totals.kanji + counts.kanji,
      vocab: totals.vocab + counts.vocab,
    };
  },
  { kanji: 0, vocab: 0 },
);

const studyModes = [
  {
    title: "過去問題集 · Past-Style Exams",
    description:
      "Timed 本番モード runs, instant 練習モード feedback, section review, and bilingual explanations.",
    href: "/exams/",
    cta: "Open exam bank",
    mark: "試",
    badge: "Start here",
    featured: true,
  },
  {
    title: "Flashcards",
    description:
      "Flip kanji or vocabulary, grade your recall, and let spaced repetition do the rest.",
    href: practiceHref("flashcards", "N5"),
    cta: "Start flashcards",
    mark: "card",
  },
  {
    title: "Quick quiz",
    description:
      "Ten, twenty, or fifty questions built from the same JLPT lists, with missed-item review.",
    href: practiceHref("quiz", "N5"),
    cta: "Take a quiz",
    mark: "Q",
  },
  {
    title: "Tools",
    description: "Inspect Japanese text or convert romaji, hiragana, and katakana instantly.",
    href: "/tools/",
    cta: "Browse all tools",
    mark: "具",
    subLinks: [
      { label: "Text analyzer", href: "/tools/text-analyzer/" },
      { label: "Kana converter", href: "/tools/kana-converter/" },
    ],
  },
] as const;

const eyebrowClass =
  "text-[11px] font-black tracking-[0.2em] text-emerald-700 uppercase dark:text-emerald-400";
const sectionTitleClass =
  "text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-5 pt-12 pb-16 sm:px-8 sm:pt-16">
      <section className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-14">
        <div className="max-w-xl">
          <p className={eyebrowClass}>
            <span lang="ja">日本語を学ぼう</span> · Learn Japanese
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight leading-[1.08] text-slate-950 sm:text-5xl lg:text-6xl dark:text-white">
            Japanese study that stays out of your way.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
            Clean kanji and vocabulary for JLPT N5–N1, focused drills, and
            past-style exams. No account, no ads, no server — your progress
            stays in this browser.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={levelHref("N5")}
              className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              Start with N5 →
            </Link>
            <Link
              href="/exams/"
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 shadow-sm transition-colors hover:border-emerald-600 hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-500 dark:hover:text-emerald-400"
            >
              <span lang="ja">過去問題集</span> · Past Exams →
            </Link>
          </div>

          <dl className="mt-9 flex flex-wrap gap-x-8 gap-y-3 border-t border-slate-200 pt-6 dark:border-slate-800">
            <div>
              <dt className="text-[11px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                Kanji
              </dt>
              <dd className="mt-0.5 text-lg font-black text-slate-900 dark:text-white">
                {levelTotals.kanji.toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                Words
              </dt>
              <dd className="mt-0.5 text-lg font-black text-slate-900 dark:text-white">
                {levelTotals.vocab.toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                Levels
              </dt>
              <dd className="mt-0.5 text-lg font-black text-slate-900 dark:text-white">
                N5–N1
              </dd>
            </div>
          </dl>
        </div>

        <KanjiPreviewCard candidates={previewKanji} />
      </section>

      <section aria-labelledby="levels-heading" className="flex flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className={eyebrowClass}>Pick a level</p>
            <h2 id="levels-heading" className={`mt-1 ${sectionTitleClass}`}>
              JLPT N5–N1
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Every level has its own searchable kanji and vocabulary hub.
            </p>
          </div>
          <Link
            href={practiceHref("flashcards", "N5")}
            className="text-sm font-bold text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-400"
          >
            Or start with N5 flashcards →
          </Link>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {LEVELS.map((level) => {
            const meta = LEVEL_META[level];
            const counts = levelCounts(level);
            return (
              <li key={level}>
                <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-700">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`rounded-lg border px-2.5 py-1 text-xs font-black ${meta.softAccent} ${meta.accent}`}
                    >
                      {level}
                    </span>
                    <span className="text-[10px] font-black tracking-widest text-slate-300 uppercase dark:text-slate-600">
                      JLPT
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-950 dark:text-white">
                    {meta.label}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {counts.kanji.toLocaleString()} kanji ·{" "}
                    {counts.vocab.toLocaleString()} words
                  </p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-5">
                    <Link
                      href={levelHref(level)}
                      className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-700 dark:bg-white dark:text-slate-950 dark:hover:bg-emerald-400"
                    >
                      Study →
                    </Link>
                    <Link
                      href={practiceHref("quiz", level)}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:border-emerald-500 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-emerald-500 dark:hover:text-emerald-400"
                    >
                      Quiz
                    </Link>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="modes-heading" className="flex flex-col gap-6">
        <div>
          <p className={eyebrowClass}>Study your way</p>
          <h2 id="modes-heading" className={`mt-1 ${sectionTitleClass}`}>
            Study modes &amp; <span lang="ja">過去問題集</span>
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Four focused ways to practise. Pick one and keep your progress in
            this browser.
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {studyModes.map((mode) => (
            <li key={mode.title}>
              <article
                className={`flex h-full flex-col gap-4 rounded-2xl border bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900 ${
                  "featured" in mode && mode.featured
                    ? "border-emerald-300 ring-1 ring-emerald-200 dark:border-emerald-800 dark:ring-emerald-900/60"
                    : "border-slate-200 hover:border-emerald-300 dark:border-slate-800 dark:hover:border-emerald-700"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-sm font-black text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                    <span lang={mode.mark.length === 1 ? "ja" : undefined}>
                      {mode.mark}
                    </span>
                  </span>
                  {"badge" in mode && mode.badge ? (
                    <span className="rounded-full bg-emerald-700 px-2.5 py-1 text-[10px] font-black tracking-wide text-white uppercase dark:bg-emerald-600">
                      {mode.badge}
                    </span>
                  ) : null}
                </div>

                <h3 className="text-base leading-snug font-bold text-slate-950 dark:text-white">
                  {mode.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {mode.description}
                </p>

                <div className="mt-auto flex flex-col gap-2 pt-2">
                  <Link
                    href={mode.href}
                    className="text-sm font-bold text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-400"
                  >
                    {mode.cta} →
                  </Link>
                  {"subLinks" in mode && mode.subLinks
                    ? mode.subLinks.map((subLink) => (
                        <Link
                          key={subLink.href}
                          href={subLink.href}
                          className="text-xs font-semibold text-slate-500 underline-offset-4 hover:text-emerald-700 hover:underline dark:text-slate-400 dark:hover:text-emerald-400"
                        >
                          {subLink.label} →
                        </Link>
                      ))
                    : null}
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
