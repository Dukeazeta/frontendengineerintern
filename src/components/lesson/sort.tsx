"use client";

import { useState } from "react";
import styles from "./book.module.css";

type Item = { text: string; answer: number };

// Sort each item into one of two groups. Feedback per item, straight away.
export function Sort({ prompt, groups, items }: { prompt: string; groups: [string, string]; items: Item[] }) {
  const [picked, setPicked] = useState<Record<number, number>>({});
  const right = items.filter((item, i) => picked[i] === item.answer).length;

  return (
    <div className={styles.sort}>
      <p className={styles.prompt}>{prompt}</p>
      <ul className={styles.sortItems}>
        {items.map((item, i) => {
          const choice = picked[i];
          const state = choice === undefined ? undefined : choice === item.answer ? "right" : "wrong";
          return (
            <li key={item.text} className={styles.sortItem} data-state={state}>
              <span className={styles.sortText}>{item.text}</span>
              <span className={styles.sortChoices} role="group" aria-label={item.text}>
                {groups.map((group, g) => (
                  <button
                    key={group}
                    type="button"
                    className={styles.sortChoice}
                    aria-pressed={choice === g}
                    data-state={choice === g ? state : undefined}
                    onClick={() => setPicked((current) => ({ ...current, [i]: g }))}
                  >
                    {group}
                  </button>
                ))}
              </span>
            </li>
          );
        })}
      </ul>
      <p className={styles.quizStatus} aria-live="polite" data-complete={right === items.length || undefined}>
        {right === items.length ? "All sorted." : `${right} of ${items.length} sorted`}
      </p>
    </div>
  );
}
