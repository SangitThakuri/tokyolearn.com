import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContentForLevel, getContentItem, getContentSlugs } from "@/content";
import { getLevelBySlug } from "@/lib/levels";
import { contentLevelSlugs } from "@/lib/levelRoutes";
import type { GrammarPoint } from "@/lib/types";

export const dynamicParams = false;

export function generateStaticParams() {
  const params: { level: string; slug: string }[] = [];
  for (const level of contentLevelSlugs) {
    const slugs = getContentSlugs(level, "grammar");
    for (const slug of slugs) {
      params.push({ level, slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ level: string; slug: string }> }): Promise<Metadata> {
  const { level, slug } = await params;
  const item = getContentItem(level, "grammar", slug) as GrammarPoint | undefined;
  if (!item) return {};
  return {
    title: item.metaTitle,
    description: item.metaDescription,
  };
}

export default async function GrammarDetailPage({ params }: { params: Promise<{ level: string; slug: string }> }) {
  const { level, slug } = await params;
  const item = getContentItem(level, "grammar", slug) as GrammarPoint | undefined;
  if (!item) notFound();

  const info = getLevelBySlug(level);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-2 text-sm text-zinc-500">
        <Link href={`/${level}`} className="hover:underline">{info?.label ?? level}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${level}/grammar`} className="hover:underline">Grammar</Link>
        <span className="mx-2">/</span>
        <span>{item.slug}</span>
      </div>

      <h1 className="mb-2 text-3xl font-bold">{item.title}</h1>
      <p className="mb-8 text-lg text-zinc-600 dark:text-zinc-400">{item.meaning}</p>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">Formation</h2>
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 font-mono text-sm dark:border-zinc-800 dark:bg-zinc-900">
          {item.structure}
        </div>
        <p className="mt-3 text-zinc-700 dark:text-zinc-300">{item.formation}</p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">Usage</h2>
        <p className="text-zinc-700 dark:text-zinc-300">{item.usage}</p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Examples</h2>
        <div className="space-y-4">
          {item.examples.map((ex, i) => (
            <ExampleBlock key={i} japanese={ex.japanese} reading={ex.reading} english={ex.english} />
          ))}
        </div>
      </section>

      {item.relatedPoints.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-semibold">Related Grammar</h2>
          <div className="flex flex-wrap gap-2">
            {item.relatedPoints.map((slug) => (
              <RelatedGrammarLink key={slug} level={level} slug={slug} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ExampleBlock({ japanese, reading, english }: { japanese: string; reading: string; english: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-lg font-medium">{japanese}</p>
      <p className="text-sm text-zinc-500">{reading}</p>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{english}</p>
    </div>
  );
}

function RelatedGrammarLink({ level, slug }: { level: string; slug: string }) {
  const item = getContentItem(level, "grammar", slug) as GrammarPoint | undefined;
  if (!item) return null;
  return (
    <Link
      href={`/${level}/grammar/${slug}`}
      className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
    >
      {item.title}
    </Link>
  );
}
