import { GrammarPoint, VocabWord, KanjiCharacter } from "@/lib/types";
import { n5Grammar, grammarMap as n5GrammarMap, grammarSlugs as n5GrammarSlugs } from "./grammar/n5";
import { n5Vocab, vocabMap as n5VocabMap, vocabSlugs as n5VocabSlugs } from "./vocab/n5";
import { n5Kanji, kanjiMap as n5KanjiMap, kanjiSlugs as n5KanjiSlugs } from "./kanji/n5";

export type ContentLevel = "n5" | "n4" | "n3" | "n2" | "n1" | "absolute-beginner" | "pro";

interface ContentRegistry {
  grammar: GrammarPoint[];
  vocabulary: VocabWord[];
  kanji: KanjiCharacter[];
}

interface ContentMaps {
  grammar: Record<string, GrammarPoint>;
  vocabulary: Record<string, VocabWord>;
  kanji: Record<string, KanjiCharacter>;
}

interface ContentSlugs {
  grammar: string[];
  vocabulary: string[];
  kanji: string[];
}

const registry: Record<string, ContentRegistry> = {
  n5: { grammar: n5Grammar, vocabulary: n5Vocab, kanji: n5Kanji },
};

const maps: Record<string, ContentMaps> = {
  n5: { grammar: n5GrammarMap as unknown as Record<string, GrammarPoint>, vocabulary: n5VocabMap as unknown as Record<string, VocabWord>, kanji: n5KanjiMap as unknown as Record<string, KanjiCharacter> },
};

const slugs: Record<string, ContentSlugs> = {
  n5: { grammar: n5GrammarSlugs, vocabulary: n5VocabSlugs, kanji: n5KanjiSlugs },
};

export function getContentForLevel<T extends keyof ContentRegistry>(
  level: string,
  type: T
): ContentRegistry[T] {
  return registry[level]?.[type] ?? [];
}

export function getContentItem<T extends keyof ContentMaps>(
  level: string,
  type: T,
  key: string
): ContentMaps[T][string] | undefined {
  return maps[level]?.[type]?.[key] as ContentMaps[T][string] | undefined;
}

export function getContentSlugs<T extends keyof ContentSlugs>(
  level: string,
  type: T
): ContentSlugs[T] {
  return slugs[level]?.[type] ?? [];
}

export function getAllContentLevels(): string[] {
  return Object.keys(registry);
}

export function getAllGrammar(): GrammarPoint[] {
  return Object.values(registry).flatMap((r) => r.grammar);
}

export function getAllVocabulary(): VocabWord[] {
  return Object.values(registry).flatMap((r) => r.vocabulary);
}

export function getAllKanji(): KanjiCharacter[] {
  return Object.values(registry).flatMap((r) => r.kanji);
}
