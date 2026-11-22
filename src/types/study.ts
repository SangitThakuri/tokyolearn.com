/** Shared types for the client-side study engines. */

export type StudyMode = "kanji" | "vocab";

export type QuizType = "kanjiToReading" | "readingToKanji" | "meaningToKanji";

export type QuestionCount = 10 | 20 | 50;

export type Rating = "again" | "good" | "mastered";
