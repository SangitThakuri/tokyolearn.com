/** Pure pass/fail calculation for the JLPT score checker. */

import type { JlptLevelOverview, JlptScoringSection } from "@/types/reference";

export interface SectionScoreResult {
  section: JlptScoringSection;
  value: number;
  passed: boolean;
  valid: boolean;
}

export interface ScoreCheckResult {
  total: number;
  totalPass: number;
  totalMax: number;
  passed: boolean;
  sections: SectionScoreResult[];
}

export function checkJlptScores(
  overview: JlptLevelOverview,
  scores: Readonly<Record<string, string>>,
): ScoreCheckResult | null {
  const sections: SectionScoreResult[] = [];
  let total = 0;

  for (const section of overview.sections) {
    const raw = scores[section.id]?.trim() ?? "";
    if (!/^\d+$/.test(raw)) return null;
    const value = Number(raw);
    const valid = value >= 0 && value <= section.max;
    total += value;
    sections.push({ section, value, valid, passed: value >= section.min });
  }

  if (sections.some((result) => !result.valid)) return null;

  return {
    total,
    totalPass: overview.totalPass,
    totalMax: overview.totalMax,
    sections,
    passed: total >= overview.totalPass && sections.every((result) => result.passed),
  };
}
