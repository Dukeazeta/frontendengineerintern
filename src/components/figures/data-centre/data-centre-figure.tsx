"use client";

import { useEffect, useRef } from "react";
import "@/components/iso/iso.css";
import "../hero/hero.css";
import "./figure.css";
import { FIG_META, FIG_SVG } from "./art.generated";
import { mountDataCentre } from "./live.mjs";

const SERVERS = [1, 2, 3, 4, 5, 6];

export function DataCentreFigure() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    return mountDataCentre(root.current, FIG_META);
  }, []);

  return (
    <div ref={root} className="iso fe-figure" data-theme="light">
      <figure className="iso-figure">
        <div className="iso-plate fe-plate">
          <div className="iso-plate-corners" aria-hidden="true">
            <span className="iso-plate-corner" data-corner="fig">Fig 1.4</span>
            <span className="iso-plate-corner" data-corner="title">Where servers live</span>
            <span className="iso-plate-corner" data-corner="hint">Tap a server</span>
            <span className="iso-plate-corner" data-corner="readout" data-readout>
              6 servers in this rack
            </span>
          </div>
          <div
            className="iso-stage dc-stage"
            aria-label="Fig 1.4. A rack of six servers in a data centre. Choose a server to see which websites it keeps."
            dangerouslySetInnerHTML={{ __html: FIG_SVG }}
          />
          <span className="fe-sr" role="status" aria-live="polite" data-status />
        </div>
        <div className="fe-switches fe-switches-wrap" role="group" aria-label="Servers, numbered from the bottom">
          {SERVERS.map((n) => (
            <button key={n} type="button" className="fe-toggle" data-server-button={n - 1} aria-pressed="false">
              Server {n}
            </button>
          ))}
        </div>
      </figure>
    </div>
  );
}
