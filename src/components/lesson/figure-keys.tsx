"use client";

import { useRef } from "react";
import styles from "./book.module.css";

export type FigureKey = { key: string; label: string; detail: string };

// A numbered key under a figure. Pointing at an entry brings that part forward and dims the rest.
export function FigureKeys({ keys }: { keys: FigureKey[] }) {
  const ref = useRef<HTMLOListElement>(null);

  function focus(key: string | null) {
    const figure = ref.current?.closest("figure")?.querySelector<HTMLElement>(".fe-figure");
    if (!figure) return;
    if (key) figure.dataset.focus = key;
    else delete figure.dataset.focus;
  }

  return (
    <ol ref={ref} className={styles.keys}>
      {keys.map((item, i) => (
        <li key={item.key}>
          <button
            type="button"
            className={styles.key}
            onMouseEnter={() => focus(item.key)}
            onMouseLeave={() => focus(null)}
            onFocus={() => focus(item.key)}
            onBlur={() => focus(null)}
          >
            <span className={styles.keyNum}>{i + 1}</span>
            <span>
              <span className={styles.keyLabel}>{item.label}</span>
              <span className={styles.keyDetail}>{item.detail}</span>
            </span>
          </button>
        </li>
      ))}
    </ol>
  );
}
