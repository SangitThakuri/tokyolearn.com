import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContentForLevel, getContentSlugs } from "@/content";
import { getLevelBySlug } from "@/lib/levels";
import { contentLevelSlugs } from "@/lib/levelRoutes";

export const dynamicParams = false;

export function generateStaticParams() {
  return contentLevelSlugs.map((slug) => ({ level: slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ level: string }> }): Promise<Metadata> {
  const { level } = await params;
  const info = getLevelBySlug(level);
  if (!info) return {};
  return { title: `${info.label} Grammar — TokyoLearn`, description: `Grammar points for ${info.label}` };
}

export default async function GrammarListPage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params;
  const info = getLevelBySlug(level);
  if (!info) notFound();

  const grammarItems = getContentForLevel(level, "grammar") as { slug: string; title: string; meaning: string }[];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-2 text-sm text-zinc-500">
        <Link href={`/${level}`} className="hover:underline">{info.label}</Link>
        <span className="mx-2">/</span>
        <span>Grammar</span>
      </div>
      <h1 className="mb-8 text-3xl font-bold">Grammar — {info.label}</h1>

      <div className="space-y-3">
        {grammarItems.length === 0 && (
          <p className="text-zinc-500">No grammar points available yet.</p>
        )}
        {grammarItems.map((item) => (
          <Link
            key={item.slug}
            href={`/${level}/grammar/${item.slug}`}
            className="block rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
          >
            <h2 className="mb-1 font-semibold">{item.title}</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{item.meaning}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
