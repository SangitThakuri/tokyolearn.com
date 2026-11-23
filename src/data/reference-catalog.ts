/**
 * Build-time registry for the structured reference datasets in /data/reference.
 * Reference tools import from here instead of hardcoding topic arrays in UI.
 */
import bodyParts from "../../data/reference/body-parts.json";
import colors from "../../data/reference/colors.json";
import counters from "../../data/reference/counters.json";
import familyTerms from "../../data/reference/family-terms.json";
import foodDrink from "../../data/reference/food-drink.json";
import jlptOverview from "../../data/reference/jlpt-overview.json";
import professions from "../../data/reference/professions.json";
import timeDirections from "../../data/reference/time-directions.json";
import weather from "../../data/reference/weather.json";
import type {
  JlptOverviewDataset,
  ReferenceDataset,
  ReferenceItem,
  TopicReferenceDataset,
} from "@/types/reference";

export const referenceDatasets: readonly ReferenceDataset[] = [
  colors,
  counters,
  bodyParts,
  familyTerms,
  timeDirections,
  weather,
  foodDrink,
  professions,
  jlptOverview,
] as unknown as readonly ReferenceDataset[];

export const topicReferenceDatasets: readonly TopicReferenceDataset[] =
  referenceDatasets.filter(
    (dataset): dataset is TopicReferenceDataset => dataset.kind === "topic",
  );

export const jlptReference: JlptOverviewDataset = jlptOverview as unknown as JlptOverviewDataset;

export function getReferenceDataset(id: string): ReferenceDataset | undefined {
  return referenceDatasets.find((dataset) => dataset.id === id);
}

export function referenceItemCount(dataset: ReferenceDataset): number {
  return dataset.kind === "topic" ? dataset.items.length : dataset.levelsData.length;
}

export function allReferenceItems(): ReferenceItem[] {
  return topicReferenceDatasets.flatMap((dataset) => dataset.items);
}
