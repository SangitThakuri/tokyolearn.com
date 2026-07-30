import type { Metadata } from "next";
import Link from "next/link";
import { getAllGrammar, getAllVocabulary, getAllKanji } from "@/content";

export const metadata: Metadata = {
  title: "Search — TokyoLearn",
  description: "Search all grammar points, vocabulary, and kanji.",
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = (q ?? "").trim().toLowerCase();

  const allGrammar = getAllGrammar();
  const allVocab = getAllVocabulary();
  const allKanji = getAllKanji();

  const grammarResults = query
    ? allGrammar.filter(
        (g) =>
          g.title.toLowerCase().includes(query) ||
          g.slug.toLowerCase().includes(query) ||
          g.meaning.toLowerCase().includes(query)
      )
    : [];

  const vocabResults = query
    ? allVocab.filter(
        (v) =>
          v.word.toLowerCase().includes(query) ||
          v.reading.toLowerCase().includes(query) ||
          v.meaning.toLowerCase().includes(query) ||
          v.slug.toLowerCase().includes(query)
      )
    : [];

  const kanjiResults = query
    ? allKanji.filter(
        (k) =>
          k.character.toLowerCase().includes(query) ||
          k.meaning.toLowerCase().includes(query)
      )
    : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold">Search</h1>

      <form className="mb-8">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search grammar, vocabulary, kanji…"
          className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-base outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-blue-400"
          autoFocus
        />
      </form>

      {query === "" && (
        <p className="text-center text-zinc-500">Enter a search term to find grammar, vocabulary, or kanji.</p>
      )}

      {query && grammarResults.length === 0 && vocabResults.length === 0 && kanjiResults.length === 0 && (
        <p className="text-center text-zinc-500">No results found for &ldquo;{q}&rdquo;.</p>
      )}

      {grammarResults.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-xl font-semibold">Grammar ({grammarResults.length})</h2>
          <div className="space-y-2">
            {grammarResults.map((g) => (
              <Link
                key={g.id}
                href={`/${g.level}/grammar/${g.slug}`}
                className="block rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-medium">{g.title}</span>
                  <span className="text-xs uppercase text-zinc-400">{g.level}</span>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{g.meaning}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {vocabResults.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-xl font-semibold">Vocabulary ({vocabResults.length})</h2>
          <div className="space-y-2">
            {vocabResults.map((v) => (
              <Link
                key={v.id}
                href={`/${v.level}/vocab/${v.slug}`}
                className="block rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
              >
                <div className="flex items-baseline gap-3">
                  <span className="text-lg font-medium">{v.word}</span>
                  <span className="text-sm text-zinc-500">{v.reading}</span>
                  <span className="text-xs uppercase text-zinc-400">{v.level}</span>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{v.meaning}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {kanjiResults.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-semibold">Kanji ({kanjiResults.length})</h2>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {kanjiResults.map((k) => (
              <Link
                key={k.id}
                href={`/${k.level}/kanji/${k.character}`}
                className="flex flex-col items-center rounded-lg border border-zinc-200 bg-white p-3 text-center transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
              >
                <span className="text-xl font-bold">{k.character}</span>
                <span className="text-xs text-zinc-500">{k.meaning}</span>
                <span className="mt-0.5 text-[10px] uppercase text-zinc-400">{k.level}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
