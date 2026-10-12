"use client";

import { useEffect, useState } from "react";
import styles from "./book.module.css";

export type Question = {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  right: string;
  wrong: string;
};

const storageKey = (lesson: string) => `fei:done:${lesson}`;

function readDone(lesson: string) {
  try {
    return localStorage.getItem(storageKey(lesson)) === "1";
  } catch {
    return false;
  }
}

// Retrieval practice: answer from memory, get feedback at once, retry until right.
export function Quiz({ lesson, questions, done: doneText }: { lesson: string; questions: Question[]; done: string }) {
  const [picked, setPicked] = useState<Record<string, number[]>>({});
  const [already, setAlready] = useState(false);

  useEffect(() => {
    // Read after hydration so the server and first client render match.
    const id = requestAnimationFrame(() => setAlready(readDone(lesson)));
    return () => cancelAnimationFrame(id);
  }, [lesson]);

  const solved = questions.filter((q) => picked[q.id]?.includes(q.answer)).length;
  const complete = solved === questions.length;

  useEffect(() => {
    if (!complete) return;
    try {
      localStorage.setItem(storageKey(lesson), "1");
    } catch {
      // Private mode or blocked storage: the lesson still works, progress just isn't kept.
    }
  }, [complete, lesson]);

  function choose(q: Question, i: number) {
    setPicked((current) => {
      const tries = current[q.id] ?? [];
      if (tries.includes(q.answer) || tries.includes(i)) return current;
      return { ...current, [q.id]: [...tries, i] };
    });
  }

  return (
    <div className={styles.quiz}>
      <ol className={styles.questions}>
        {questions.map((q, n) => {
          const tries = picked[q.id] ?? [];
          const right = tries.includes(q.answer);
          const last = tries[tries.length - 1];
          return (
            <li key={q.id} className={styles.question}>
              <p className={styles.prompt}>
                <span className={styles.qNum}>{n + 1}</span>
                {q.prompt}
              </p>
              <div className={styles.options} role="group" aria-label={`Question ${n + 1}`}>
                {q.options.map((option, i) => {
                  const state = tries.includes(i) ? (i === q.answer ? "right" : "wrong") : undefined;
                  return (
                    <button
                      key={option}
                      type="button"
                      className={styles.option}
                      data-state={state}
                      disabled={right && i !== q.answer}
                      aria-pressed={tries.includes(i)}
                      onClick={() => choose(q, i)}
                    >
                      <span className={styles.mark} aria-hidden="true" />
                      {option}
                    </button>
                  );
                })}
              </div>
              <p className={styles.feedback} aria-live="polite" data-state={last === undefined ? undefined : right ? "right" : "wrong"}>
                {last === undefined ? "" : right ? q.right : q.wrong}
              </p>
            </li>
          );
        })}
      </ol>
      <p className={styles.quizStatus} aria-live="polite" data-complete={complete || undefined}>
        {complete ? doneText : already ? "You finished this lesson before. Try the questions again from memory." : `${solved} of ${questions.length} right`}
      </p>
    </div>
  );
}
