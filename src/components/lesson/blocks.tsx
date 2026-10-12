import type { ReactNode } from "react";
import styles from "./book.module.css";

// A numbered figure with its caption, set wider than the text column.
export function Figure({ n, caption, children }: { n: string; caption: ReactNode; children: ReactNode }) {
  return (
    <figure className={styles.figure} id={`fig-${n}`}>
      <div className={styles.figureBody}>{children}</div>
      <figcaption className={styles.caption}>
        <span className={styles.captionNum}>Fig {n}</span> {caption}
      </figcaption>
    </figure>
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
