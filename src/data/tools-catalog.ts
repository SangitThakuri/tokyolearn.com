/**
 * Single source of truth for the /tools hub, the static [slug] route, metadata,
 * and the sitemap. Adding a tool here is enough to publish its page on build.
 */

export const TOOL_CATEGORIES = [
  {
    id: "kanji-lookup",
    label: "Kanji & Lookup",
    jaLabel: "漢字・検索",
    description: "Highlights, search, and browse the N5–N1 kanji datasets.",
    icon: "漢",
  },
  {
    id: "quizzes-games",
    label: "Quizzes & Games",
    jaLabel: "クイズ・ゲーム",
    description: "Exam-readiness checks and quick JLPT challenges.",
    icon: "試",
  },
  {
    id: "text-converters",
    label: "Text & Converters",
    jaLabel: "文章・変換",
    description: "Analyze scripts, learn kana, and convert Japanese text.",
    icon: "文",
  },
  {
    id: "reference-study",
    label: "Reference & Study",
    jaLabel: "参考・学習",
    description: "Study planning, official pass marks, and focus sessions.",
    icon: "学",
  },
] as const;

export type ToolCategoryId = (typeof TOOL_CATEGORIES)[number]["id"];
export type ToolCategoryFilter = ToolCategoryId | "all";

export interface ToolCategory {
  readonly id: ToolCategoryId;
  readonly label: string;
  readonly jaLabel: string;
  readonly description: string;
  readonly icon: string;
}

export interface ToolEntry {
  readonly slug: string;
  readonly path: string;
  readonly title: string;
  readonly jaTitle: string;
  readonly category: ToolCategoryId;
  readonly icon: string;
  readonly summary: string;
  readonly description: string;
  readonly keywords: readonly string[];
  readonly badge?: string;
  readonly datasetIds?: readonly string[];
  readonly seo: {
    readonly title: string;
    readonly description: string;
  };
}

export function toolPath(slug: string): string {
  return `/tools/${slug}/`;
}

export const TOOLS = [
  {
    slug: "text-analyzer",
    path: toolPath("text-analyzer"),
    title: "Japanese text analyzer",
    jaTitle: "文章分析",
    category: "text-converters",
    icon: "文字",
    summary: "Count scripts, punctuation, and the N5–N1 kanji mix in any pasted text.",
    description:
      "Paste Japanese text to see kanji, hiragana, katakana, romaji/ASCII, and punctuation counts, plus an estimated JLPT level breakdown for its kanji.",
    keywords: ["count", "kanji", "script", "punctuation", "analysis", "文字", "分析"],
    datasetIds: ["kanji-n5", "kanji-n4", "kanji-n3", "kanji-n2", "kanji-n1"],
    seo: {
      title: "Japanese Text Analyzer — Count Kanji, Kana & JLPT Levels",
      description:
        "Paste Japanese text to count kanji, hiragana, katakana, romaji/ASCII, and punctuation, with an N5–N1 JLPT kanji breakdown.",
    },
  },
  {
    slug: "kanji-highlighter",
    path: toolPath("kanji-highlighter"),
    title: "Kanji highlighter",
    jaTitle: "漢字ハイライト",
    category: "kanji-lookup",
    icon: "蛍",
    summary: "Color-code every kanji in your text by JLPT level and inspect it instantly.",
    description:
      "See N5–N1 kanji color-coded inside pasted Japanese text. Click any highlighted character for its readings, meanings, and example words.",
    keywords: ["highlight", "colors", "reading", "meaning", "漢字", "色分け"],
    datasetIds: ["kanji-n5", "kanji-n4", "kanji-n3", "kanji-n2", "kanji-n1"],
    seo: {
      title: "Kanji Highlighter — Color Japanese Text by JLPT Level",
      description:
        "Highlight kanji in any Japanese text by N5–N1 level and click each character to inspect readings, meanings, and examples.",
    },
  },
  {
    slug: "kanji-dictionary",
    path: toolPath("kanji-dictionary"),
    title: "Kanji dictionary",
    jaTitle: "漢字辞典",
    category: "kanji-lookup",
    icon: "辞",
    summary: "Search 2,383 kanji by character, kana reading, or English meaning.",
    description:
      "Look up any kanji across N5–N1 by its character, on’yomi or kun’yomi reading, or English meaning. Results include level, readings, and examples.",
    keywords: ["dictionary", "search", "reading", "meaning", "辞書", "検索"],
    datasetIds: ["kanji-n5", "kanji-n4", "kanji-n3", "kanji-n2", "kanji-n1"],
    seo: {
      title: "Kanji Dictionary — Search N5–N1 by Reading or Meaning",
      description:
        "Search the full TokyoLearn kanji dataset by character, kana reading, or English meaning across every JLPT level.",
    },
  },
  {
    slug: "kanji-grid",
    path: toolPath("kanji-grid"),
    title: "Kanji grid",
    jaTitle: "漢字グリッド",
    category: "kanji-lookup",
    icon: "盤",
    summary: "A compact, clickable grid of every kanji, filterable by level.",
    description:
      "Browse the complete kanji set as a dense grid. Filter by JLPT level or search by character and meaning, then open any kanji for full details.",
    keywords: ["grid", "browse", "level", "filter", "一覧", "グリッド"],
    datasetIds: ["kanji-n5", "kanji-n4", "kanji-n3", "kanji-n2", "kanji-n1"],
    seo: {
      title: "Kanji Grid — Browse Every JLPT N5–N1 Kanji",
      description:
        "A compact, clickable kanji grid with JLPT level filters and quick links to readings, meanings, and examples.",
    },
  },
  {
    slug: "kana-chart",
    path: toolPath("kana-chart"),
    title: "Kana chart",
    jaTitle: "五十音図",
    category: "text-converters",
    icon: "あ",
    summary: "Interactive hiragana and katakana charts with ja-JP audio.",
    description:
      "Explore gojūon, dakuten, and yōon in hiragana or katakana. Tap any cell to hear it pronounced, or print the chart for your desk.",
    keywords: ["gojūon", "hiragana", "katakana", "dakuten", "yōon", "audio", "五十音"],
    seo: {
      title: "Interactive Kana Chart — Hiragana, Katakana & Audio",
      description:
        "Browse gojūon, dakuten, and yōon charts in hiragana and katakana with Japanese audio and print-friendly styling.",
    },
  },
  {
    slug: "kana-converter",
    path: toolPath("kana-converter"),
    title: "Kana converter",
    jaTitle: "かな変換",
    category: "text-converters",
    icon: "かな",
    summary: "Instant hiragana ↔ katakana conversion with one-click copy.",
    description:
      "Switch between hiragana and katakana as you type, with optional romaji support and a copy button for the result.",
    keywords: ["hiragana", "katakana", "convert", "copy", "かな", "カナ", "変換"],
    seo: {
      title: "Hiragana ↔ Katakana Converter — Copy Instantly",
      description:
        "Convert between hiragana and katakana instantly in your browser, with optional romaji input and one-click copy.",
    },
  },
  {
    slug: "romaji-converter",
    path: toolPath("romaji-converter"),
    title: "Romaji converter",
    jaTitle: "ローマ字変換",
    category: "text-converters",
    icon: "R",
    summary: "Turn kana and Japanese text into Hepburn-style romaji.",
    description:
      "Convert hiragana and katakana to Hepburn romaji instantly. Kanji are approximated using their N5–N1 dictionary readings.",
    keywords: ["romaji", "hepburn", "transliterate", "copy", "ローマ字"],
    seo: {
      title: "Japanese to Romaji Converter — Hepburn style",
      description:
        "Convert kana to Hepburn romaji instantly. Paste Japanese text and copy the transliteration with one click.",
    },
  },
  {
    slug: "jlpt-score-checker",
    path: toolPath("jlpt-score-checker"),
    title: "JLPT score checker",
    jaTitle: "合格判定",
    category: "quizzes-games",
    icon: "合",
    summary: "Check total and sectional scores against official JLPT pass marks.",
    description:
      "Enter your N5–N1 section scores and see whether you meet the official overall pass mark and every sectional minimum.",
    keywords: ["score", "pass", "fail", "result", "official", "合格", "点数"],
    datasetIds: ["jlpt-overview"],
    seo: {
      title: "JLPT Score Checker — Overall & Sectional Pass Marks",
      description:
        "Enter your JLPT section scores for N5–N1 and check them against the official overall and sectional pass marks.",
    },
  },
  {
    slug: "jlpt-countdown",
    path: toolPath("jlpt-countdown"),
    title: "JLPT countdown",
    jaTitle: "試験カウントダウン",
    category: "quizzes-games",
    icon: "日",
    summary: "Count down to the July and December JLPT test windows.",
    description:
      "See a live countdown to the next JLPT test day, with the upcoming July and December windows and a quick level selector.",
    keywords: ["countdown", "exam date", "july", "december", "timer", "試験日"],
    datasetIds: ["jlpt-overview"],
    seo: {
      title: "JLPT Countdown — Days Until the Next Exam",
      description:
        "A live countdown to upcoming July and December JLPT test windows with a quick level selector.",
    },
  },
  {
    slug: "study-timer",
    path: toolPath("study-timer"),
    title: "Study timer",
    jaTitle: "勉強タイマー",
    category: "reference-study",
    icon: "⏱",
    summary: "Custom Pomodoro focus and break sessions saved in this browser.",
    description:
      "Run a customizable focus and break timer with sound and visual alerts, plus a session counter stored locally in localStorage.",
    keywords: ["pomodoro", "focus", "break", "timer", "sessions", "タイマー"],
    seo: {
      title: "Pomodoro Study Timer — Focus & Break Sessions",
      description:
        "A customizable Pomodoro study timer with sound alerts, visual cues, and a session counter saved in your browser.",
    },
  },
] as const satisfies readonly ToolEntry[];

export type ToolSlug = (typeof TOOLS)[number]["slug"];

export function getToolBySlug(slug: string): ToolEntry | undefined {
  return TOOLS.find((tool) => tool.slug === slug);
}

export function getCategoryById(id: ToolCategoryFilter): ToolCategory | undefined {
  if (id === "all") return undefined;
  return TOOL_CATEGORIES.find((category) => category.id === id);
}

export function filterTools(
  query: string,
  category: ToolCategoryFilter,
): ToolEntry[] {
  const needle = query.trim().toLowerCase();
  return TOOLS.filter((tool) => {
    if (category !== "all" && tool.category !== category) return false;
    if (!needle) return true;
    const haystack = [
      tool.title,
      tool.jaTitle,
      tool.summary,
      tool.description,
      ...tool.keywords,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });
}
