"use client";

import { Fragment, createElement, useEffect, useId, type CSSProperties, type ElementType } from "react";

// Text that resolves from blur word by word when it enters the viewport.
// It renders fully visible; the blur is only applied once the script runs.
export function Reveal({
  as = "p",
  text,
  className,
  id,
  delay = 0,
}: {
  as?: ElementType;
  text: string;
  className?: string;
  id?: string;
  delay?: number;
}) {
  const key = useId();

  useEffect(() => {
    const el = document.querySelector<HTMLElement>(`[data-reveal-key="${CSS.escape(key)}"]`);
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.dataset.reveal = "armed";
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          el.dataset.reveal = "in";
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [key]);

  const words = text.split(" ");
  return createElement(
    as,
    { "data-reveal-key": key, id, className, style: { "--d": `${delay}ms` } as CSSProperties },
    words.map((word, i) => (
      <Fragment key={i}>
        <span className="rw" style={{ "--i": i } as CSSProperties}>
          {word}
        </span>
        {i < words.length - 1 ? " " : null}
      </Fragment>
    )),
  );
}
