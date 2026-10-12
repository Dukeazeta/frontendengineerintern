"use client";

import { useEffect, useRef } from "react";
import "@/components/iso/iso.css";
import "../hero/hero.css";
import "./figure.css";
import { FIG_META, FIG_SVG } from "./art.generated";
import { mountServerLookup } from "./live.mjs";

const FILES = ["index.html", "style.css", "app.js", "photo.jpg", "missing.html"];

export function ServerLookupFigure() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    return mountServerLookup(root.current, FIG_META);
  }, []);

  return (
    <div ref={root} className="iso fe-figure" data-theme="light">
      <figure className="iso-figure">
        <div className="iso-plate fe-plate">
          <div className="iso-plate-corners" aria-hidden="true">
            <span className="iso-plate-corner" data-corner="fig">Fig 1.2</span>
            <span className="iso-plate-corner" data-corner="title">Inside the server</span>
            <span className="iso-plate-corner" data-corner="hint">Ask for a file</span>
            <span className="iso-plate-corner" data-corner="readout" data-readout>
              4 files stored
            </span>
          </div>
          <div
            className="iso-stage sl-stage"
            tabIndex={0}
            aria-label="Fig 1.2. Press 1 to 5 to ask the server for index.html, style.css, app.js, photo.jpg or missing.html."
            dangerouslySetInnerHTML={{ __html: FIG_SVG }}
          />
          <span className="fe-sr" role="status" aria-live="polite" data-status />
        </div>
        <div className="fe-switches fe-switches-wrap" role="group" aria-label="Ask the server for">
          {FILES.map((name, i) => (
            <button key={name} type="button" className="fe-toggle" data-file-button={i}>
              {name}
            </button>
          ))}
        </div>
      </figure>
    </div>
  );
}
