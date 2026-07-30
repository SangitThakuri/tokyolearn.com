export type JLPTLevel = "absolute-beginner" | "n5" | "n4" | "n3" | "n2" | "n1" | "pro";

export type ContentType = "grammar" | "vocab" | "kanji" | "reading";

export interface GrammarPoint {
  id: string;
  slug: string;
  title: string;
  level: JLPTLevel;
  meaning: string;
  structure: string;
  formation: string;
  usage: string;
  examples: ExampleSentence[];
  relatedPoints: string[];
  metaTitle: string;
  metaDescription: string;
}

export interface VocabWord {
  id: string;
  slug: string;
  word: string;
  reading: string;
  meaning: string;
  level: JLPTLevel;
  kanji: string;
  partOfSpeech: string;
  exampleSentences: ExampleSentence[];
  tags: string[];
  metaTitle: string;
  metaDescription: string;
}

export interface KanjiCharacter {
  id: string;
  character: string;
  meaning: string;
  onyomi: string[];
  kunyomi: string[];
  level: JLPTLevel;
  strokeCount: number;
  radical: string;
  examples: KanjiExample[];
  mnemonics?: string;
  metaTitle: string;
  metaDescription: string;
}

export interface ExampleSentence {
  japanese: string;
  reading: string;
  english: string;
}

export interface KanjiExample {
  word: string;
  reading: string;
  meaning: string;
}

export interface ReadingPassage {
  id: string;
  slug: string;
  title: string;
  level: JLPTLevel;
  content: string;
  furigana: string;
  translation: string;
  vocab: { word: string; reading: string; meaning: string }[];
  metaTitle: string;
  metaDescription: string;
}

export interface LevelInfo {
  level: JLPTLevel;
  label: string;
  description: string;
  kanjiCount: number;
  vocabCount: number;
  grammarCount: number;
  color: string;
  gradient: string;
}
