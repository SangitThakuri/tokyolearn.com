"use client";

import { useState } from "react";
import {
  EXAM_QUESTION_TYPE_LABELS,
  EXAM_SECTIONS,
  EXAM_SECTION_LABELS,
  type ExamListening,
  type ExamPaper,
  type ExamPassage,
  type ExamQuestion,
} from "@/types/exam";

function ListeningControls({ listening }: { listening: ExamListening }) {
  const play = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(listening.transcript.ja);
    utterance.lang = listening.speechLang ?? "ja-JP";
    utterance.rate = listening.speechRate ?? 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/60">
      {listening.audioUrl ? (
        <audio controls src={listening.audioUrl} className="w-full" />
      ) : (
        <button
          type="button"
          onClick={play}
          className="self-start rounded-lg bg-slate-900 px-3 py-2 text-sm font-bold text-white hover:bg-slate-700 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          ▶ Play transcript (browser voice)
        </button>
      )}
      <details className="text-sm">
        <summary className="cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
          Transcript / スクリプト
        </summary>
        <p lang="ja" className="mt-2 leading-relaxed text-slate-800 dark:text-slate-200">
          {listening.transcript.ja}
        </p>
        <p className="mt-1 leading-relaxed text-slate-600 dark:text-slate-400">
          {listening.transcript.en}
        </p>
      </details>
    </div>
  );
}

function Passage({ passage }: { passage: ExamPassage }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
      <h3 lang="ja" className="text-lg font-bold text-slate-950 dark:text-white">
        {passage.title.ja}
      </h3>
      <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
        {passage.title.en}
      </p>
      <p
        lang="ja"
        className="mt-3 text-base leading-8 text-slate-800 dark:text-slate-200"
      >
        {passage.text.ja}
      </p>
      <details className="mt-3 text-sm">
        <summary className="cursor-pointer font-semibold text-emerald-700 dark:text-emerald-400">
          English translation
        </summary>
        <p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-400">
          {passage.text.en}
        </p>
      </details>
    </article>
  );
}

function QuestionCard({
  question,
  number,
  answer,
  showAnswers,
  onAnswer,
}: {
  question: ExamQuestion;
  number: number;
  answer: number | undefined;
  showAnswers: boolean;
  onAnswer: (index: number) => void;
}) {
  const isCorrect = (index: number) => index === question.correctIndex;
  const isWrongSelection = (index: number) =>
    showAnswers && answer === index && !isCorrect(index);

  return (
    <fieldset className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <legend className="px-1 text-sm font-bold text-emerald-700 dark:text-emerald-400">
        Q{number} · {EXAM_QUESTION_TYPE_LABELS[question.type].ja} /{" "}
        {EXAM_QUESTION_TYPE_LABELS[question.type].en}
      </legend>

      <p
        lang="ja"
        className="mt-2 text-lg leading-relaxed font-semibold text-slate-950 dark:text-white"
      >
        {question.prompt.ja}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {question.prompt.en}
      </p>

      {question.listening && (
        <div className="mt-4">
          <ListeningControls listening={question.listening} />
        </div>
      )}

      {question.scrambled && (
        <p className="mt-3 text-sm font-semibold text-amber-700 dark:text-amber-400">
          ★ の位置に入る選択肢を選んでください。 / Choose the option for the ★ blank.
        </p>
      )}

      <div className="mt-4 grid gap-2">
        {question.choices.map((choice, index) => (
          <label
            key={choice.label}
            htmlFor={`${question.id}-choice-${index}`}
            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${
              showAnswers && isCorrect(index)
                ? "border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950/40"
                : isWrongSelection(index)
                  ? "border-rose-500 bg-rose-50 dark:border-rose-500 dark:bg-rose-950/40"
                  : "border-slate-200 hover:border-emerald-500 dark:border-slate-700 dark:hover:border-emerald-500"
            }`}
          >
            <input
              id={`${question.id}-choice-${index}`}
              type="radio"
              name={question.id}
              value={index}
              checked={answer === index}
              onChange={() => onAnswer(index)}
              className="mt-1 h-4 w-4 accent-emerald-700 dark:accent-emerald-400"
            />
            <span className="flex flex-col gap-0.5">
              <span lang="ja" className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {choice.label}. {choice.text}
              </span>
              {choice.translation && (
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {choice.translation}
                </span>
              )}
            </span>
          </label>
        ))}
      </div>

      {showAnswers && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-sm dark:border-emerald-900 dark:bg-emerald-950/30">
          <p className="font-bold text-emerald-800 dark:text-emerald-300">
            Answer: {question.choices[question.correctIndex].label}.{" "}
            {question.choices[question.correctIndex].text}
          </p>
          <p lang="ja" className="mt-2 leading-relaxed text-slate-800 dark:text-slate-200">
            {question.explanation.ja}
          </p>
          <p className="mt-1 leading-relaxed text-slate-600 dark:text-slate-400">
            {question.explanation.en}
          </p>
          {question.scrambled && (
            <p lang="ja" className="mt-2 font-semibold text-slate-800 dark:text-slate-200">
              完全文: {question.scrambled.completedSentence}
            </p>
          )}
        </div>
      )}
    </fieldset>
  );
}

export function ExamPaperView({ paper }: { paper: ExamPaper }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showAnswers, setShowAnswers] = useState(false);

  const answered = paper.questions.filter(
    (question) => answers[question.id] !== undefined,
  ).length;
  const correct = paper.questions.filter(
    (question) => answers[question.id] === question.correctIndex,
  ).length;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 dark:border-emerald-900 dark:bg-emerald-950/30">
        <div>
          <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
            {answered} / {paper.questions.length} answered
          </p>
          {showAnswers && (
            <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Score: {correct} / {paper.questions.length}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowAnswers((value) => !value)}
            className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            {showAnswers ? "Hide answers" : "Check answers"}
          </button>
          <button
            type="button"
            onClick={() => {
              setAnswers({});
              setShowAnswers(false);
            }}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:border-slate-500 dark:border-slate-600 dark:text-slate-300"
          >
            Reset
          </button>
        </div>
      </div>

      {EXAM_SECTIONS.map((section) => {
        const questions = paper.questions.filter(
          (question) => question.section === section,
        );
        if (questions.length === 0) return null;
        const label = EXAM_SECTION_LABELS[section];

        return (
          <section
            key={section}
            aria-labelledby={`${paper.id}-${section}-heading`}
            className="flex flex-col gap-5"
          >
            <h2
              id={`${paper.id}-${section}-heading`}
              className="flex flex-wrap items-baseline gap-3 border-b border-slate-200 pb-3 text-2xl font-black text-slate-950 dark:border-slate-800 dark:text-white"
            >
              <span lang="ja">{label.ja}</span>
              <span className="text-base font-bold text-slate-500 dark:text-slate-400">
                {label.en}
              </span>
            </h2>

            {section === "reading" &&
              paper.passages.map((passage) => (
                <Passage key={passage.id} passage={passage} />
              ))}

            <ol className="flex flex-col gap-5">
              {questions.map((question, index) => (
                <li key={question.id}>
                  <QuestionCard
                    question={question}
                    number={index + 1}
                    answer={answers[question.id]}
                    showAnswers={showAnswers}
                    onAnswer={(choiceIndex) =>
                      setAnswers((current) => ({
                        ...current,
                        [question.id]: choiceIndex,
                      }))
                    }
                  />
                </li>
              ))}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
