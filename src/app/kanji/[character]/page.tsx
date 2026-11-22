import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PronounceButton } from "@/components/PronounceButton";
import {
  allKanji,
  getKanji,
  getKanjiNeighbors,
} from "@/lib/data.server";
import {
  LEVEL_META,
  absoluteUrl,
  decodeRouteParam,
  kanjiHref,
  kanjiUrlPath,
  levelHref,
} from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return allKanji.map((kanji) => ({ character: kanji.character }));
}

function pageUrl(character: string): string {
  return absoluteUrl(kanjiUrlPath(character));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ character: string }>;
}): Promise<Metadata> {
  const { character: param } = await params;
  const character = decodeRouteParam(param);
  const kanji = getKanji(character);
  if (!kanji) return {};

  const primaryMeanings = kanji.meanings.slice(0, 3).join(", ");
  const title = `${kanji.character} 漢字 — ${kanji.meanings[0] ?? "Meaning"} | JLPT ${kanji.jlpt}`;
  const description = `Learn the kanji ${kanji.character} (${primaryMeanings}): ${kanji.strokes} strokes, on'yomi ${kanji.onyomi.join(", ") || "none"}, kun'yomi ${kanji.kunyomi.join(", ") || "none"}, with example vocabulary.`;

  return {
    title,
    description,
    alternates: { canonical: pageUrl(character) },
    openGraph: { title, description, url: pageUrl(character) },
  };
}

export default async function KanjiPage({
  params,
}: {
  params: Promise<{ character: string }>;
}) {
  const { character: param } = await params;
  const character = decodeRouteParam(param);
  const kanji = getKanji(character);
  if (!kanji) notFound();

  const { previous, next } = getKanjiNeighbors(character);
  const levelMeta = LEVEL_META[kanji.jlpt];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: kanji.character,
    description: kanji.meanings.join(", "),
    url: pageUrl(kanji.character),
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: `JLPT ${kanji.jlpt} Kanji`,
      url: absoluteUrl(`${levelHref(kanji.jlpt)}/`),
    },
  };

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-5 py-10 sm:px-8 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
        <Link href="/" className="hover:text-emerald-700 dark:hover:text-emerald-400">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          href={levelHref(kanji.jlpt)}
          className="hover:text-emerald-700 dark:hover:text-emerald-400"
        >
          JLPT {kanji.jlpt}
        </Link>
        <span aria-hidden="true">/</span>
        <span lang="ja" className="font-semibold text-slate-900 dark:text-white">
          {kanji.character}
        </span>
      </nav>

      <header className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <div
          lang="ja"
          className="flex size-36 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-8xl leading-none font-black text-white sm:size-44 sm:text-9xl dark:bg-white dark:text-slate-950"
        >
          {kanji.character}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-black tracking-widest ${levelMeta.softAccent} ${levelMeta.accent}`}
            >
              JLPT {kanji.jlpt}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {kanji.strokes} strokes
            </span>
          </div>

          <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl dark:text-white">
            {kanji.meanings.slice(0, 3).join(" · ")}
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            <PronounceButton text={kanji.character} />
            {kanji.radicals.length > 0 && (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Radical:{" "}
                <span lang="ja" className="font-bold text-slate-900 dark:text-white">
                  {kanji.radicals.join(", ")}
                </span>
              </p>
            )}
          </div>
        </div>
      </header>

      <section aria-labelledby="readings-heading" className="flex flex-col gap-3">
        <h2 id="readings-heading" className="text-xl font-bold text-slate-950 dark:text-white">
          Readings
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-xs font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
              On&apos;yomi
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {kanji.onyomi.length > 0 ? (
                kanji.onyomi.map((reading) => (
                  <span
                    key={reading}
                    lang="ja"
                    className="rounded-lg bg-slate-100 px-2.5 py-1 text-sm font-bold text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                  >
                    {reading}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-500 dark:text-slate-400">None listed</span>
              )}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-xs font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
              Kun&apos;yomi
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {kanji.kunyomi.length > 0 ? (
                kanji.kunyomi.map((reading) => (
                  <span
                    key={reading}
                    lang="ja"
                    className="rounded-lg bg-emerald-50 px-2.5 py-1 text-sm font-bold text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200"
                  >
                    {reading}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-500 dark:text-slate-400">None listed</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="meanings-heading" className="flex flex-col gap-3">
        <h2 id="meanings-heading" className="text-xl font-bold text-slate-950 dark:text-white">
          Meanings
        </h2>
        <ul className="flex flex-wrap gap-2">
          {kanji.meanings.map((meaning) => (
            <li
              key={meaning}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {meaning}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="examples-heading" className="flex flex-col gap-3">
        <h2 id="examples-heading" className="text-xl font-bold text-slate-950 dark:text-white">
          Example vocabulary
        </h2>
        <ul className="grid gap-3 sm:grid-cols-3">
          {kanji.examples.map((example, index) => (
            <li
              key={`${example.word}-${example.reading}-${index}`}
              className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <p lang="ja" className="text-2xl font-black text-slate-950 dark:text-white">
                {example.word}
              </p>
              <p lang="ja" className="mt-1 text-sm font-bold text-emerald-700 dark:text-emerald-400">
                {example.reading}
              </p>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                {example.meaning}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <nav
        aria-label="Kanji navigation"
        className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6 dark:border-slate-800"
      >
        {previous ? (
          <Link
            href={kanjiHref(previous.character)}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-800 hover:border-emerald-600 dark:border-slate-700 dark:text-slate-200"
          >
            ← <span lang="ja">{previous.character}</span>
          </Link>
        ) : (
          <span />
        )}
        <Link
          href={levelHref(kanji.jlpt)}
          className="text-sm font-bold text-emerald-700 hover:underline dark:text-emerald-400"
        >
          All JLPT {kanji.jlpt} kanji
        </Link>
        {next ? (
          <Link
            href={kanjiHref(next.character)}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-800 hover:border-emerald-600 dark:border-slate-700 dark:text-slate-200"
          >
            <span lang="ja">{next.character}</span> →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}
