import type { MetadataRoute } from "next";
import { allKanji } from "@/lib/data.server";
import { LEVELS, absoluteUrl, kanjiUrlPath, levelHref } from "@/lib/site";

export const dynamic = "force-static";

/** Statically generated at build time alongside the exported HTML pages. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...LEVELS.map((level) => ({
      url: absoluteUrl(`${levelHref(level)}/`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: absoluteUrl("/practice/flashcards/"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/practice/quiz/"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/tools/"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/tools/text-analyzer/"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/tools/kana-converter/"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...allKanji.map((kanji) => ({
      url: absoluteUrl(kanjiUrlPath(kanji.character)),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
