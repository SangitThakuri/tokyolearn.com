import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { levels, getLevelBySlug } from "@/lib/levels";
import { levelSlugs } from "@/lib/levelRoutes";

export const dynamicParams = false;

export function generateStaticParams() {
  return levelSlugs.map((slug) => ({ level: slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ level: string }> }): Promise<Metadata> {
  const { level } = await params;
  const info = getLevelBySlug(level);
  if (!info) return {};
  return {
    title: `${info.label} — TokyoLearn`,
    description: info.description,
  };
}

export default async function LevelHubPage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params;
  const info = getLevelBySlug(level);
  if (!info) notFound();

  const hasContent = ["n5", "n4", "n3", "n2", "n1"].includes(level);
  const isAbsoluteBeginner = level === "absolute-beginner";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className={`mb-2 h-2 w-16 rounded-full ${info.color}`} />
      <h1 className="mb-2 text-3xl font-bold">{info.label}</h1>
      <p className="mb-6 text-zinc-600 dark:text-zinc-400">{info.description}</p>

      <div className="mb-8 flex flex-wrap gap-6 text-sm">
        <div>
          <span className="font-semibold">{info.grammarCount}</span> grammar points
        </div>
        <div>
          <span className="font-semibold">{info.vocabCount}</span> vocabulary
        </div>
        <div>
          <span className="font-semibold">{info.kanjiCount}</span> kanji
        </div>
      </div>

      {isAbsoluteBeginner ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <SectionCard href={`/${level}/grammar`} title="Hiragana Trainer" desc="Learn to read and write hiragana" />
          <SectionCard href={`/${level}/vocab`} title="Katakana Trainer" desc="Learn to read and write katakana" />
        </div>
      ) : hasContent ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <SectionCard href={`/${level}/grammar`} title="Grammar" desc="Structured grammar points with examples" />
          <SectionCard href={`/${level}/vocab`} title="Vocabulary" desc="Word lists with readings and meanings" />
          <SectionCard href={`/${level}/kanji`} title="Kanji" desc="Kanji characters with readings and stroke order" />
        </div>
      ) : (
        <div className="rounded-lg border border-zinc-200 p-6 text-center text-zinc-500 dark:border-zinc-800">
          Content for this level is being developed. Check back soon!
        </div>
      )}
    </div>
  );
}

function SectionCard({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-zinc-200 bg-white p-6 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
    >
      <h3 className="mb-1 font-semibold">{title}</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{desc}</p>
    </Link>
  );
}
