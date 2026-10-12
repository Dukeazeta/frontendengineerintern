"use client";

import { useEffect, useRef } from "react";
import "@/components/iso/iso.css";
import "./hero.css";
import { HERO_SVG } from "./art.generated";
import { mountHero } from "./live.mjs";

const SWITCHES = ["HTML", "CSS", "JavaScript"];

export function HeroFigure({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    return mountHero(root.current);
  }, []);

  return (
    <div ref={root} className={`iso fe-figure ${className ?? ""}`} data-theme="light">
      <figure className="iso-figure">
        <div className="iso-plate fe-plate">
          <div className="iso-plate-corners" aria-hidden="true">
            <span className="iso-plate-corner" data-corner="fig">Fig 0</span>
            <span className="iso-plate-corner" data-corner="title">A web page</span>
            <span className="iso-plate-corner" data-corner="hint">Flip a switch</span>
            <span className="iso-plate-corner" data-corner="readout" data-readout>
              3 of 3 layers on · 1 click
            </span>
          </div>
          <div
            className="iso-stage fe-hero"
            tabIndex={0}
            aria-label="Fig 0. Press 1, 2 or 3 to flip the HTML, CSS and JavaScript switches."
            dangerouslySetInnerHTML={{ __html: HERO_SVG }}
          />
          <span className="fe-sr" role="status" aria-live="polite" data-status />
        </div>
        <div className="fe-switches" role="group" aria-label="Layers">
          {SWITCHES.map((name, i) => (
            <button key={name} type="button" className="fe-toggle" data-switch-button={i} aria-pressed="true">
              <span className="fe-toggle-dot" aria-hidden="true" />
              {name}
            </button>
          ))}
        </div>
      </figure>
    </div>
  );
}
