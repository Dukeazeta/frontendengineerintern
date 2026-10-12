"use client";

import { useEffect, useRef } from "react";
import "@/components/iso/iso.css";
import "../hero/hero.css";
import "./figure.css";
import { FIG_SVG } from "./art.generated";
import { mountManyFiles } from "./live.mjs";

export function ManyFilesFigure() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    return mountManyFiles(root.current);
  }, []);

  return (
    <div ref={root} className="iso fe-figure" data-theme="light">
      <figure className="iso-figure">
        <div className="iso-plate fe-plate">
          <div className="iso-plate-corners" aria-hidden="true">
            <span className="iso-plate-corner" data-corner="fig">Fig 1.2</span>
            <span className="iso-plate-corner" data-corner="title">One page, many files</span>
            <span className="iso-plate-corner" data-corner="hint">Tap the monitor to load again</span>
            <span className="iso-plate-corner" data-corner="readout" data-readout>
              One page, 4 requests
            </span>
          </div>
          <div
            className="iso-stage mf-stage"
            aria-label="Fig 1.2. A page loading in four requests: index.html, then style.css, app.js and photo.jpg."
            dangerouslySetInnerHTML={{ __html: FIG_SVG }}
          />
          <span className="fe-sr" role="status" aria-live="polite" data-status />
        </div>
        <div className="fe-switches">
          <button type="button" className="fe-toggle" data-reload>
            Load the page again
          </button>
        </div>
      </figure>
    </div>
  );
}
