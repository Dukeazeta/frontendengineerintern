"use client";

import { useEffect, useState } from "react";
import styles from "./book.module.css";

type Reading = { host: string; ms: number; files: number };

// Real numbers from the reader's own visit, read from the browser's Performance API.
export function ThisPage() {
  const [reading, setReading] = useState<Reading | null>(null);

  useEffect(() => {
    const measure = () => {
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      if (!nav) return;
      setReading({
        host: location.host,
        ms: Math.max(1, Math.round(nav.responseEnd - nav.startTime)),
        files: performance.getEntriesByType("resource").length,
      });
    };
    // Wait for the page to finish loading so the file count is complete.
    if (document.readyState === "complete") {
      const id = setTimeout(measure, 300);
      return () => clearTimeout(id);
    }
    const onLoad = () => setTimeout(measure, 300);
    window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <aside className={styles.thisPage} aria-live="polite">
      <p className={styles.thisPageLabel}>Your visit, measured by your browser</p>
      <dl className={styles.readings}>
        <div>
          <dt>Server</dt>
          <dd>{reading ? reading.host : "…"}</dd>
        </div>
        <div>
          <dt>First page arrived in</dt>
          <dd>{reading ? `${reading.ms} ms` : "…"}</dd>
        </div>
        <div>
          <dt>Files fetched since</dt>
          <dd>{reading ? reading.files : "…"}</dd>
        </div>
      </dl>
    </aside>
  );
}
