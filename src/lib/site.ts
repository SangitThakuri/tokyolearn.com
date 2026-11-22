import type { JlptLevel } from "@/types/japanese";

export const SITE_URL = "https://tokyolearn.com";
export const SITE_NAME = "TokyoLearn";

export const LEVELS: readonly JlptLevel[] = ["N5", "N4", "N3", "N2", "N1"];

export const LEVEL_META: Record<
  JlptLevel,
  {
    label: string;
    description: string;
    accent: string;
    softAccent: string;
  }
> = {
  N5: {
    label: "Absolute Beginner",
    description: "Hiragana, katakana, greetings, and the first core kanji.",
    accent: "text-emerald-700 dark:text-emerald-400",
    softAccent: "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900",
  },
  N4: {
    label: "Elementary",
    description: "Everyday conversations, common nouns, and basic verbs.",
    accent: "text-sky-700 dark:text-sky-400",
    softAccent: "bg-sky-50 border-sky-200 dark:bg-sky-950/40 dark:border-sky-900",
  },
  N3: {
    label: "Intermediate",
    description: "Nuance, context, and faster reading of real Japanese.",
    accent: "text-violet-700 dark:text-violet-400",
    softAccent: "bg-violet-50 border-violet-200 dark:bg-violet-950/40 dark:border-violet-900",
  },
  N2: {
    label: "Upper-Intermediate",
    description: "News, business, and opinion-level vocabulary and kanji.",
    accent: "text-amber-700 dark:text-amber-400",
    softAccent: "bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-900",
  },
  N1: {
    label: "Advanced",
    description: "Literary, academic, and professional-level Japanese.",
    accent: "text-rose-700 dark:text-rose-400",
    softAccent: "bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:border-rose-900",
  },
};

export function levelSlug(level: JlptLevel): string {
  return level.toLowerCase();
}

export function levelFromSlug(slug: string): JlptLevel | undefined {
  return LEVELS.find((level) => level.toLowerCase() === slug.toLowerCase());
}

export function levelHref(level: JlptLevel): string {
  return `/jlpt/${levelSlug(level)}`;
}

/** Deep link that pre-selects a level in a client-side study engine. */
export function practiceHref(
  tool: "flashcards" | "quiz",
  level: JlptLevel,
): string {
  return `/practice/${tool}?level=${levelSlug(level)}`;
}

export function kanjiHref(character: string): string {
  return `/kanji/${character}`;
}

/** URL-encoded, trailing-slash path used in canonical tags and the sitemap. */
export function kanjiUrlPath(character: string): string {
  return `/kanji/${encodeURIComponent(character)}/`;
}

/** Next.js passes non-ASCII dynamic params percent-encoded. */
export function decodeRouteParam(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function absoluteUrl(pathname: string): string {
  return `${SITE_URL}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}
