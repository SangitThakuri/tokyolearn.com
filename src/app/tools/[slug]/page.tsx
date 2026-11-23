import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TOOL_COMPONENTS } from "@/components/tools/tool-components";
import {
  getCategoryById,
  getToolBySlug,
  TOOLS,
  type ToolSlug,
} from "@/data/tools-catalog";
import { absoluteUrl } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return TOOLS.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};

  const url = absoluteUrl(tool.path);
  return {
    title: tool.seo.title,
    description: tool.seo.description,
    alternates: { canonical: url },
    openGraph: {
      title: tool.seo.title,
      description: tool.seo.description,
      url,
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const category = getCategoryById(tool.category);
  const ToolComponent = TOOL_COMPONENTS[tool.slug as ToolSlug];
  const related = TOOLS.filter(
    (item) => item.slug !== tool.slug && item.category === tool.category,
  ).slice(0, 3);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-10 sm:px-8 sm:py-14">
      <header className="flex flex-col gap-4">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
        >
          <Link href="/tools/" className="hover:text-emerald-700 dark:hover:text-emerald-400">
            Tools
          </Link>
          <span aria-hidden="true">/</span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {category?.label ?? tool.category}
          </span>
        </nav>

        <div className="flex flex-wrap items-center gap-3">
          <span
            aria-hidden="true"
            lang="ja"
            className="grid size-12 place-items-center rounded-xl bg-emerald-50 text-xl font-black text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
          >
            {tool.icon}
          </span>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black tracking-widest text-emerald-800 uppercase dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
            {category?.label ?? "Tool"}
          </span>
          <span className="text-sm text-slate-500 dark:text-slate-500">
            Runs locally in your browser
          </span>
        </div>

        <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl dark:text-white">
          {tool.title}
        </h1>
        <p lang="ja" className="text-base font-bold text-slate-500 dark:text-slate-400">
          {tool.jaTitle}
        </p>
        <p className="max-w-3xl text-base leading-relaxed text-slate-700 sm:text-lg dark:text-slate-300">
          {tool.description}
        </p>
      </header>

      <ToolComponent />

      {related.length > 0 ? (
        <section
          aria-labelledby="related-tools-heading"
          className="flex flex-col gap-4 border-t border-slate-200 pt-8 dark:border-slate-800"
        >
          <h2 id="related-tools-heading" className="text-lg font-bold text-slate-950 dark:text-white">
            More in {category?.label ?? "this category"}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-3">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={item.path}
                  className="flex h-full flex-col gap-1.5 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-600"
                >
                  <span aria-hidden="true" lang="ja" className="text-xl font-black text-emerald-700 dark:text-emerald-400">
                    {item.icon}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">{item.title}</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{item.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
