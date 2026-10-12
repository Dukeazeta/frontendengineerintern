import type { ReactNode } from "react";
import { FigureKeys, type FigureKey } from "./figure-keys";
import styles from "./book.module.css";

// A numbered figure with its caption and, optionally, a numbered key to its parts.
export function Figure({ n, caption, keys, children }: { n: string; caption: ReactNode; keys?: FigureKey[]; children: ReactNode }) {
  return (
    <figure className={styles.figure} id={`fig-${n}`}>
      <div className={styles.figureBody}>{children}</div>
      <figcaption className={styles.caption}>
        <span className={styles.captionNum}>Fig {n}</span> {caption}
      </figcaption>
      {keys ? <FigureKeys keys={keys} /> : null}
    </figure>
  );
}

// The section in a few lines, at the end.
export function InShort({ children }: { children: ReactNode }) {
  return (
    <aside className={styles.inShort} aria-label="In short">
      <p className={styles.inShortLabel}>In short</p>
      <div className={styles.inShortBody}>{children}</div>
    </aside>
  );
}

// One thing beginners often get wrong, said plainly.
export function MixUp({ children }: { children: ReactNode }) {
  return (
    <aside className={styles.mixUp} aria-label="Common mix-up">
      <p className={styles.mixUpLabel}>Common mix-up</p>
      <div className={styles.mixUpBody}>{children}</div>
    </aside>
  );
}

// A margin note: in the side margin on wide screens, inline below the paragraph on small ones.
export function Note({ term, children }: { term?: string; children: ReactNode }) {
  return (
    <aside className={styles.note}>
      {term ? <span className={styles.noteTerm}>{term}</span> : null}
      <span className={styles.noteBody}>{children}</span>
    </aside>
  );
}

// A footnote marker that points at the numbered sources at the end of the section.
export function Cite({ n }: { n: number }) {
  return (
    <sup className={styles.cite}>
      <a href={`#source-${n}`} aria-label={`Source ${n}`}>
        {n}
      </a>
    </sup>
  );
}
