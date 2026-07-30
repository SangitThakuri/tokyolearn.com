import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContentForLevel } from "@/content";
import { getLevelBySlug } from "@/lib/levels";
import { contentLevelSlugs } from "@/lib/levelRoutes";
import type { KanjiCharacter } from "@/lib/types";

export const dynamicParams = false;

export function generateStaticParams() {
  return contentLevelSlugs.map((slug) => ({ level: slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ level: string }> }): Promise<Metadata> {
  const { level } = await params;
  const info = getLevelBySlug(level);
  if (!info) return {};
  return { title: `${info.label} Kanji — TokyoLearn`, description: `Kanji characters for ${info.label}` };
}

export default async function KanjiListPage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params;
  const info = getLevelBySlug(level);
  if (!info) notFound();

  const kanjiItems = getContentForLevel(level, "kanji") as KanjiCharacter[];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-2 text-sm text-zinc-500">
        <Link href={`/${level}`} className="hover:underline">{info.label}</Link>
        <span className="mx-2">/</span>
        <span>Kanji</span>
      </div>
      <h1 className="mb-8 text-3xl font-bold">Kanji — {info.label}</h1>

      {kanjiItems.length === 0 && (
        <p className="text-zinc-500">No kanji available yet.</p>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {kanjiItems.map((item) => (
          <Link
            key={item.character}
            href={`/${level}/kanji/${item.character}`}
            className="flex flex-col items-center rounded-xl border border-zinc-200 bg-white p-4 text-center transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
          >
            <span className="mb-1 text-2xl font-bold">{item.character}</span>
            <span className="text-xs text-zinc-600 dark:text-zinc-400">{item.meaning}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
