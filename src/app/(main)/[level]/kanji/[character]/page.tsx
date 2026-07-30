import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContentForLevel, getContentItem } from "@/content";
import { getLevelBySlug } from "@/lib/levels";
import { contentLevelSlugs } from "@/lib/levelRoutes";
import type { KanjiCharacter } from "@/lib/types";

export const dynamicParams = false;

export function generateStaticParams() {
  const params: { level: string; character: string }[] = [];
  for (const level of contentLevelSlugs) {
    const items = getContentForLevel(level, "kanji") as KanjiCharacter[];
    for (const item of items) {
      params.push({ level, character: item.character });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ level: string; character: string }> }): Promise<Metadata> {
  const { level, character } = await params;
  const item = getContentItem(level, "kanji", character) as KanjiCharacter | undefined;
  if (!item) return {};
  return {
    title: item.metaTitle,
    description: item.metaDescription,
  };
}

export default async function KanjiDetailPage({ params }: { params: Promise<{ level: string; character: string }> }) {
  const { level, character } = await params;
  const item = getContentItem(level, "kanji", character) as KanjiCharacter | undefined;
  if (!item) notFound();

  const info = getLevelBySlug(level);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-2 text-sm text-zinc-500">
        <Link href={`/${level}`} className="hover:underline">{info?.label ?? level}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${level}/kanji`} className="hover:underline">Kanji</Link>
        <span className="mx-2">/</span>
        <span>{item.character}</span>
      </div>

      <div className="mb-8 flex items-start gap-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-xl border border-zinc-200 bg-white text-5xl font-bold dark:border-zinc-800 dark:bg-zinc-900">
          {item.character}
        </div>
        <div>
          <h1 className="mb-1 text-3xl font-bold">{item.meaning}</h1>
          <p className="text-sm text-zinc-500">
            Stroke count: {item.strokeCount} &middot; Radical: {item.radical}
          </p>
        </div>
      </div>

      <div className="mb-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-2 font-semibold">Onyomi (Chinese reading)</h2>
          <p className="text-lg font-mono">
            {item.onyomi.length > 0 ? item.onyomi.join(", ") : "—"}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-2 font-semibold">Kunyomi (Japanese reading)</h2>
          <p className="text-lg font-mono">
            {item.kunyomi.length > 0 ? item.kunyomi.join(", ") : "—"}
          </p>
        </div>
      </div>

      {item.mnemonics && (
        <section className="mb-8">
          <h2 className="mb-3 text-xl font-semibold">Mnemonics</h2>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
            {item.mnemonics}
          </div>
        </section>
      )}

      {item.examples.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold">Example Words</h2>
          <div className="space-y-3">
            {item.examples.map((ex, i) => (
              <div
                key={i}
                className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <p className="text-lg font-medium">{ex.word}</p>
                <p className="text-sm text-zinc-500">{ex.reading}</p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{ex.meaning}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
