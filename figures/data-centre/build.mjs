// Fig 1.4: where servers live. A corner of a data centre: a closed rack and an open rack of
// six servers on a raised floor with a cooling vent tile. Tap a server and it slides out;
// the readout says which websites it keeps.
//
// node figures/data-centre/build.mjs
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../kit/iso-kit.mjs";
import { helpers } from "../lib.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT = join(ROOT, "src", "components", "figures", "data-centre");

const WIDTH = 640;
const HEIGHT = 470;

const PLATE = { x: -118, y: -64, w: 236, d: 140, r: 10 };
const RACK = { x: -22, y: -44, w: 72, d: 62, r: 2 };
const RACK_Z = [6, 150];
const FRONT = RACK.y + RACK.d;
const CLOSED = { x: -100, y: -44, w: 72, d: 62, r: 2 };
const UNIT = 13;
const GAP = 5;
const SERVERS = [0, 1, 2, 3, 4, 5].map((i) => {
  const z0 = 26 + i * (UNIT + GAP);
  return { z0, z1: z0 + UNIT };
});
const SLIDE = 18;
const SWITCH_Z = [128, 138];

const P = k.fitProjection([...k.boxCorners(PLATE, -15, 0), ...k.boxCorners({ x: -100, y: -44, w: 150, d: 62, r: 0 }, 0, RACK_Z[1])], WIDTH, HEIGHT, {
  pad: 22,
  azimuth: 50,
});
const { at, S, L, D, byDepth, planeOf, flat, plate } = helpers(P, "dc");

// Raised floor tiles and the perforated cooling tile in front of the open rack.
function floor() {
  const out = [];
  const tiles = [];
  for (let x = PLATE.x + 10; x + 30 <= PLATE.x + PLATE.w - 10; x += 31) {
    for (let y = PLATE.y + 10; y + 30 <= PLATE.y + PLATE.d - 18; y += 31) tiles.push({ x, y, w: 30, d: 30, r: 1 });
  }
  out.push(L(tiles.map((t) => k.planOutline(t, 0, P, 2)).join(""), { tone: "faint" }));
  const vent = { x: RACK.x + 6, y: FRONT + 8, w: 30, d: 30, r: 1 };
  out.push(S(k.slabOf(vent, 0, 0.6, P, 2), { tone: "lo", crease: "none" }));
  out.push(D(k.dotGrid(vent.x + 4, vent.y + 4, 8, 8, 3.1, 0.6, P), { size: 0.4, tone: "lo" }));
  return out.join("");
}

function closedRack() {
  const out = [`<path class="iso-halo" d="${k.haloOf(CLOSED, 0, 8, P)}"/>`];
  out.push(S(k.slabOf(CLOSED, 0, RACK_Z[0], P, 3), { tone: "lo" }));
  out.push(S(k.slabOf(CLOSED, RACK_Z[0], RACK_Z[1] - RACK_Z[0], P, 3, 1), { tone: "mid" }));
  const front = CLOSED.y + CLOSED.d;
  out.push(`<g transform="${planeOf(front)}"><path class="iso-line" data-tone="lo" d="${flat(CLOSED.x + 4, RACK_Z[0] + 4, CLOSED.x + CLOSED.w - 4, RACK_Z[1] - 4, 1.5)}"/></g>`);
  out.push(D(k.pointsAt(Array.from({ length: 14 * 22 }, (_, n) => [CLOSED.x + 12 + (n % 14) * 3.6, front, RACK_Z[0] + 18 + Math.floor(n / 14) * 5]), P), { size: 0.35, tone: "lo" }));
  out.push(S(k.slabOf({ x: CLOSED.x + CLOSED.w - 10, y: front, w: 3, d: 2.4, r: 0.8 }, 70, 24, P, 2), { tone: "mid" }));
  return out.join("");
}

function rackFrame(back) {
  const out = [];
  const posts = k.corners(RACK, 2.5).filter(([, y]) => (back ? y < RACK.y + RACK.d / 2 : y > RACK.y + RACK.d / 2));
  for (const [x, y] of byDepth(posts)) out.push(S(k.slabOf({ x: x - 2.5, y: y - 2.5, w: 5, d: 5, r: 0.8 }, RACK_Z[0], RACK_Z[1] - RACK_Z[0], P, 2), { tone: "mid", crease: "none" }));
  if (back) {
    out.push(`<path class="iso-halo" d="${k.haloOf(RACK, 0, 8, P)}"/>`);
    out.push(S(k.slabOf(RACK, 0, RACK_Z[0], P, 3, 0.6), { tone: "lo" }));
    // Power strip down the back
    out.push(S(k.slabOf({ x: RACK.x + RACK.w - 9, y: RACK.y + 3, w: 4, d: 4, r: 1 }, RACK_Z[0] + 8, 110, P, 2), { tone: "lo" }));
  } else {
    out.push(S(k.slabOf({ ...RACK, h: 0 }, RACK_Z[1], 4, P, 3, 0.6), { tone: "mid" }));
  }
  return out.join("");
}

function server(i) {
  const { z0, z1 } = SERVERS[i];
  const body = { x: RACK.x + 5, y: RACK.y + 4, w: RACK.w - 10, d: RACK.d - 5, r: 1 };
  const out = [];
  out.push(S(k.slabOf(body, z0, z1 - z0, P, 2, 0.4), { tone: "hi", crease: "lo", inner: L(k.sideSeam(body, z0 + 2, P, 2), { tone: "faint" }) }));
  const face = body.y + body.d;
  // Ears with screws, drive bays, lights
  [body.x - 3, body.x + body.w].forEach((x) => {
    out.push(S(k.slabOf({ x, y: face - 1.2, w: 3, d: 1.2, r: 0.4 }, z0, z1 - z0, P, 2), { tone: "mid" }));
    out.push(D([at([x + 1.5, face, z0 + 3]), at([x + 1.5, face, z1 - 3])], { size: 0.4 }));
  });
  out.push(`<g transform="${planeOf(face)}">${L(Array.from({ length: 6 }, (_, b) => flat(body.x + 4 + b * 7, z0 + 3, body.x + 9.6 + b * 7, z1 - 3, 0.6, 3)).join(""), { tone: "lo" })}</g>`);
  out.push(`<g class="dc-light" data-light="${i}">${D([at([body.x + body.w - 8, face, z0 + UNIT / 2])], { size: 0.75, tone: "hi" })}</g>`);
  out.push(D([at([body.x + body.w - 4, face, z0 + UNIT / 2])], { size: 0.6, tone: "mid" }));
  return `<g class="dc-server" data-server="${i}">${out.join("")}</g>`;
}

function networkSwitch() {
  const body = { x: RACK.x + 5, y: RACK.y + 4, w: RACK.w - 10, d: RACK.d - 5, r: 1 };
  const face = body.y + body.d;
  const out = [S(k.slabOf(body, SWITCH_Z[0], SWITCH_Z[1] - SWITCH_Z[0], P, 2, 0.4), { tone: "mid" })];
  out.push(`<g transform="${planeOf(face)}">${L(Array.from({ length: 12 }, (_, b) => flat(body.x + 4 + b * 4.6, SWITCH_Z[0] + 2.5, body.x + 7.4 + b * 4.6, SWITCH_Z[1] - 2.5, 0.4, 2)).join(""), { tone: "lo" })}</g>`);
  return out.join("");
}

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "A corner of a data centre on a raised floor: a closed rack, and an open rack holding six servers under a network switch, with a perforated cooling tile in front. Tapping a server slides it out of the rack, and the readout says which websites that server keeps.",
  body: [plate(PLATE, { ruler: false }), floor(), closedRack(), rackFrame(true), ...[0, 1, 2, 3, 4, 5].map(server), networkSwitch(), rackFrame(false)],
});

const META = { slide: k.axisVector(P, [0, SLIDE, 0]) };
mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "art.generated.ts"), `// Generated by figures/data-centre/build.mjs. Do not edit by hand.\nexport const FIG_SVG = ${JSON.stringify(svg)};\nexport const FIG_META = ${JSON.stringify(META)};\n`);

const live = readFileSync(join(OUT, "live.mjs"), "utf8").replace(/^import .*$/gm, "").replace(/^export /gm, "");
const css = readFileSync(join(OUT, "figure.css"), "utf8") + readFileSync(join(ROOT, "src", "components", "figures", "hero", "hero.css"), "utf8").split("/* On the landing page")[0];
const body = `<style>${css}</style>` + k.plateHtml({ fig: "Fig 1.4", title: "Where servers live", hint: "Tap a server", readout: "6 servers", keys: [], caption: "", body: `<div class="iso-stage dc-stage" tabindex="0">${svg}</div>` });
mkdirSync(join(HERE, "out"), { recursive: true });
writeFileSync(join(HERE, "out", "fig.html"), k.pageHtml({ title: "Fig 1.4", theme: "light", body, script: `document.body.classList.add("fe-figure");\n${live}\nmountDataCentre(document.querySelector(".iso-plate"), ${JSON.stringify(META)});` }));
console.log("wrote art.generated.ts and out/fig.html");
