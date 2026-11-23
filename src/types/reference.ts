/** Shared shapes for structured reference datasets under /data/reference. */

import type { JlptLevel } from "./japanese";

export interface LocalizedLabel {
  ja: string;
  en: string;
}

export interface ReferenceExample {
  ja: string;
  en: string;
  reading?: string;
}

export interface ReferenceField {
  label: LocalizedLabel;
  value: LocalizedLabel;
}

/**
 * Generic topic entry. A future reference viewer only needs to understand this
 * shape, so new topics can be added as JSON without new UI code per item.
 */
export interface ReferenceItem {
  id: string;
  term: LocalizedLabel;
  reading?: string;
  romaji?: string;
  group?: string;
  detail?: LocalizedLabel;
  fields?: ReferenceField[];
  examples?: ReferenceExample[];
  tags?: string[];
}

export interface ReferenceDatasetBase {
  id: string;
  title: LocalizedLabel;
  description: LocalizedLabel;
  icon: string;
  category: "basics" | "vocabulary" | "grammar" | "exam";
  levels?: JlptLevel[];
}

export interface TopicReferenceDataset extends ReferenceDatasetBase {
  kind: "topic";
  items: ReferenceItem[];
}

export interface JlptScoringSection {
  id: "language-knowledge" | "reading" | "listening" | "language-reading";
  label: LocalizedLabel;
  max: number;
  min: number;
}

export interface JlptLevelOverview {
  level: JlptLevel;
  label: LocalizedLabel;
  description: LocalizedLabel;
  totalMax: number;
  totalPass: number;
  sections: JlptScoringSection[];
  focus: LocalizedLabel[];
}

export interface ExamWindowSeed {
  year: number;
  /** 1-based month; the JLPT is held in July and December. */
  month: 7 | 12;
  day: number;
  official: boolean;
}

export interface JlptOverviewDataset extends ReferenceDatasetBase {
  kind: "jlpt-overview";
  levelsData: JlptLevelOverview[];
  examWindows: ExamWindowSeed[];
}

export type ReferenceDataset = TopicReferenceDataset | JlptOverviewDataset;
