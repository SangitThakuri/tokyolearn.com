import { JLPTLevel } from "./types";

export const levelSlugs: JLPTLevel[] = [
  "absolute-beginner",
  "n5",
  "n4",
  "n3",
  "n2",
  "n1",
  "pro",
];

export const contentLevelSlugs: JLPTLevel[] = ["n5", "n4", "n3", "n2", "n1"];

export function levelPath(level: string, type: string, slug?: string): string {
  const base = `/${level}/${type}`;
  return slug ? `${base}/${slug}` : base;
}
