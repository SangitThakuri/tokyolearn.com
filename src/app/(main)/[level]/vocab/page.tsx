import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContentForLevel } from "@/content";
import { getLevelBySlug } from "@/lib/levels";
import { contentLevelSlugs } from "@/lib/levelRoutes";
import type { VocabWord } from "@/lib/types";

export const dynamicParams = false;

export function generateStaticParams() {
  return contentLevelSlugs.map((slug) => ({ level: slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ level: string }> }): Promise<Metadata> {
  const { level } = await params;
  const info = getLevelBySlug(level);
  if (!info) return {};
  return { title: `${info.label} Vocabulary — TokyoLearn`, description: `Vocabulary words for ${info.label}` };
}

export default async function VocabListPage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params;
  const info = getLevelBySlug(level);
  if (!info) notFound();

  const vocabItems = getContentForLevel(level, "vocabulary") as VocabWord[];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-2 text-sm text-zinc-500">
        <Link href={`/${level}`} className="hover:underline">{info.label}</Link>
        <span className="mx-2">/</span>
        <span>Vocabulary</span>
      </div>
      <h1 className="mb-8 text-3xl font-bold">Vocabulary — {info.label}</h1>

      <div className="space-y-3">
        {vocabItems.length === 0 && (
          <p className="text-zinc-500">No vocabulary available yet.</p>
        )}
        {vocabItems.map((item) => (
          <Link
            key={item.slug}
            href={`/${level}/vocab/${item.slug}`}
            className="block rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
          >
            <div className="mb-1 flex items-baseline gap-3">
              <h2 className="text-lg font-semibold">{item.word}</h2>
              <span className="text-sm text-zinc-500">{item.reading}</span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{item.meaning}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
