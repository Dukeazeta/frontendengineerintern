"use client";

import { useEffect, useState } from "react";
import styles from "./book.module.css";

// Numbered steps in the text that play the matching step in a figure, and light up as the figure runs.
export function Steps({ fig, steps }: { fig: string; steps: string[] }) {
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const onActive = (event: Event) => {
      const { fig: f, step } = (event as CustomEvent<{ fig: string; step: number }>).detail;
      if (f === fig) setActive(step);
    };
    window.addEventListener("fei:step-active", onActive);
    return () => window.removeEventListener("fei:step-active", onActive);
  }, [fig]);

  function play(step: number) {
    window.dispatchEvent(new CustomEvent("fei:step", { detail: { fig, step } }));
    document.getElementById(`fig-${fig}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <ol className={styles.steps}>
      {steps.map((text, i) => (
        <li key={text}>
          <button type="button" className={styles.step} data-active={active === i || undefined} onClick={() => play(i)}>
            <span className={styles.stepNum}>{i + 1}</span>
            <span className={styles.stepText}>{text}</span>
            <span className={styles.stepPlay}>Play in Fig {fig}</span>
          </button>
        </li>
      ))}
    </ol>
  );
}
