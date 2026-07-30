import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContentItem, getContentSlugs } from "@/content";
import { getLevelBySlug } from "@/lib/levels";
import { contentLevelSlugs } from "@/lib/levelRoutes";
import type { VocabWord } from "@/lib/types";

export const dynamicParams = false;

export function generateStaticParams() {
  const params: { level: string; slug: string }[] = [];
  for (const level of contentLevelSlugs) {
    const slugs = getContentSlugs(level, "vocabulary");
    for (const slug of slugs) {
      params.push({ level, slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ level: string; slug: string }> }): Promise<Metadata> {
  const { level, slug } = await params;
  const item = getContentItem(level, "vocabulary", slug) as VocabWord | undefined;
  if (!item) return {};
  return {
    title: item.metaTitle,
    description: item.metaDescription,
  };
}

export default async function VocabDetailPage({ params }: { params: Promise<{ level: string; slug: string }> }) {
  const { level, slug } = await params;
  const item = getContentItem(level, "vocabulary", slug) as VocabWord | undefined;
  if (!item) notFound();

  const info = getLevelBySlug(level);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-2 text-sm text-zinc-500">
        <Link href={`/${level}`} className="hover:underline">{info?.label ?? level}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${level}/vocab`} className="hover:underline">Vocabulary</Link>
        <span className="mx-2">/</span>
        <span>{item.slug}</span>
      </div>

      <div className="mb-8">
        <div className="flex items-baseline gap-4">
          <h1 className="text-4xl font-bold">{item.word}</h1>
          <span className="text-xl text-zinc-500">{item.reading}</span>
        </div>
        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">{item.meaning}</p>
      </div>

      <div className="mb-8 flex flex-wrap gap-4 text-sm">
        <div className="rounded-md bg-zinc-100 px-3 py-1 dark:bg-zinc-800">
          {item.partOfSpeech}
        </div>
        {item.tags.map((tag) => (
          <div key={tag} className="rounded-md bg-zinc-100 px-3 py-1 dark:bg-zinc-800">
            {tag}
          </div>
        ))}
      </div>

      {item.exampleSentences.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold">Example Sentences</h2>
          <div className="space-y-4">
            {item.exampleSentences.map((ex, i) => (
              <div
                key={i}
                className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <p className="text-lg font-medium">{ex.japanese}</p>
                <p className="text-sm text-zinc-500">{ex.reading}</p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{ex.english}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
