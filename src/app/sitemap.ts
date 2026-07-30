import type { MetadataRoute } from "next";
import { getAllContentLevels, getContentSlugs } from "@/content";
import { levels } from "@/lib/levels";

const SITE_URL = "https://tokyolearn.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/tools`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/tools/hiragana`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/tools/katakana`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/tools/flashcards`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/placement`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/dashboard`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/search`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.4 },
    { url: `${SITE_URL}/absolute-beginner`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/absolute-beginner/hiragana`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/absolute-beginner/katakana`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  const levelsPages: MetadataRoute.Sitemap = levels.map((l) => ({
    url: `${SITE_URL}/${l.level}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const contentLevels = getAllContentLevels();

  const listPages: MetadataRoute.Sitemap = contentLevels.flatMap((level) =>
    ["grammar", "vocab", "kanji"].map((type) => ({
      url: `${SITE_URL}/${level}/${type}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  );

  const grammarPages: MetadataRoute.Sitemap = contentLevels.flatMap((level) =>
    getContentSlugs(level, "grammar").map((slug) => ({
      url: `${SITE_URL}/${level}/grammar/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  const vocabPages: MetadataRoute.Sitemap = contentLevels.flatMap((level) =>
    getContentSlugs(level, "vocabulary").map((slug) => ({
      url: `${SITE_URL}/${level}/vocab/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  const kanjiPages: MetadataRoute.Sitemap = contentLevels.flatMap((level) =>
    getContentSlugs(level, "kanji").map((slug) => ({
      url: `${SITE_URL}/${level}/kanji/${encodeURIComponent(slug)}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  return [
    ...staticPages,
    ...levelsPages,
    ...listPages,
    ...grammarPages,
    ...vocabPages,
    ...kanjiPages,
  ];
}
