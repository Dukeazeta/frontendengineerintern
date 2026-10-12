"use client";

import { useEffect, useRef } from "react";
import "@/components/iso/iso.css";
import "../hero/hero.css";
import "./figure.css";
import { FIG_META, FIG_SVG } from "./art.generated";
import { mountClientServer } from "./live.mjs";

const DEVICES = ["Phone", "Tablet", "Monitor"];

export function ClientServerFigure() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    return mountClientServer(root.current, FIG_META);
  }, []);

  return (
    <div ref={root} className="iso fe-figure" data-theme="light">
      <figure className="iso-figure">
        <div className="iso-plate fe-plate">
          <div className="iso-plate-corners" aria-hidden="true">
            <span className="iso-plate-corner" data-corner="fig">Fig 1.1</span>
            <span className="iso-plate-corner" data-corner="title">Client and server</span>
            <span className="iso-plate-corner" data-corner="hint">Tap a device</span>
            <span className="iso-plate-corner" data-corner="readout" data-readout>
              3 clients, 1 server
            </span>
          </div>
          <div
            className="iso-stage cs-stage"
            tabIndex={0}
            aria-label="Fig 1.1. Press 1, 2 or 3 to make the phone, tablet or monitor ask the server for a page."
            dangerouslySetInnerHTML={{ __html: FIG_SVG }}
          />
          <span className="fe-sr" role="status" aria-live="polite" data-status />
        </div>
        <div className="fe-switches" role="group" aria-label="Ask the server from">
          {DEVICES.map((name, i) => (
            <button key={name} type="button" className="fe-toggle" data-ask={i}>
              {name} asks
            </button>
          ))}
        </div>
      </figure>
    </div>
  );
}
