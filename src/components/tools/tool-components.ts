import type { ComponentType } from "react";
import type { ToolSlug } from "@/data/tools-catalog";
import { JlptCountdown } from "@/components/tools/JlptCountdown";
import { JlptScoreChecker } from "@/components/tools/JlptScoreChecker";
import { KanaChart } from "@/components/tools/KanaChart";
import { KanaConverter } from "@/components/tools/KanaConverter";
import { KanjiDictionary } from "@/components/tools/KanjiDictionary";
import { KanjiGrid } from "@/components/tools/KanjiGrid";
import { KanjiHighlighter } from "@/components/tools/KanjiHighlighter";
import { RomajiConverter } from "@/components/tools/RomajiConverter";
import { StudyTimer } from "@/components/tools/StudyTimer";
import { TextAnalyzer } from "@/components/tools/TextAnalyzer";

/** Maps registry slugs to their interactive client components. */
export const TOOL_COMPONENTS: Record<ToolSlug, ComponentType> = {
  "text-analyzer": TextAnalyzer,
  "kanji-highlighter": KanjiHighlighter,
  "kanji-dictionary": KanjiDictionary,
  "kanji-grid": KanjiGrid,
  "kana-chart": KanaChart,
  "kana-converter": KanaConverter,
  "romaji-converter": RomajiConverter,
  "jlpt-score-checker": JlptScoreChecker,
  "jlpt-countdown": JlptCountdown,
  "study-timer": StudyTimer,
};
