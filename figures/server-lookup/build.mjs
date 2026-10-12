// Fig 1.2: how a server finds a file. Inside the server: a tray of file cards, a picker
// carriage on rails above them, an out tray where copies leave, and a status display.
// Ask for a file; the picker runs to its card and a copy goes out, or the slot is empty
// and the display shows 404 Not Found.
//
// node figures/server-lookup/build.mjs
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../kit/iso-kit.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT = join(ROOT, "src", "components", "figures", "server-lookup");

const WIDTH = 640;
const HEIGHT = 400;

const PLATE = { x: -126, y: -62, w: 252, d: 138, r: 10 };
const PLATE_H = 10;
const FOOT_H = 5;

const TRAY = { x: -92, y: -32, w: 156, d: 46, r: 2 };
const TRAY_Z = 3;
const CARD_X = [-72, -44, -16, 12];
const MISSING_X = 40;
const CARD = { y: -26, d: 32, t: 1.6, z0: TRAY_Z, z1: 30 };

const POSTS_X = [-104, 76];
const RAIL_Y = [-29, 9];
const RAIL_Z = 50;
const CARRIAGE = { w: 18, y: -33, d: 46, z0: RAIL_Z + 3, h: 6 };
const PROBE_Y = -12;
const PROBE_DROP = 9;

const OUTBOX = { x: 86, y: -14, w: 30, d: 28, r: 3 };
const OUT_H = 7;
const COPY_TRAVEL = 26;

const PANEL = { x: -120, y: 34, w: 66, d: 3, r: 2.5 };
const PANEL_Z = [7, 41];

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), ...k.boxCorners({ x: -110, y: -35, w: 190, d: 48, r: 0 }, 0, RAIL_Z + 10)],
  WIDTH,
  HEIGHT,
  { pad: 22, azimuth: 52 },
);

const at = (point) => k.iso(point, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const byDepth = (points) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
const planeOf = (y) => k.sideMatrix([0, y], 0, P, "left");
const flat = (x0, z0, x1, z1, r, steps = 6) =>
  k.pathOf(k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, steps).map(([u, z]) => [u, -z]), true);

let clips = 0;
function recess({ x0, x1, z0, z1, r, depth }, y, back = "", backClass = "sl-well") {
  const id = `sl-clip-${clips++}`;
  const ring = k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, 6);
  const cx = (x0 + x1) / 2;
  const cz = (z0 + z1) / 2;
  const { sinA } = k.cameraOf(P);
  const tops = [];
  const sides = [[], [], [], []];
  ring.forEach(([ax, az], index) => {
    const [bx, bz] = ring[(index + 1) % ring.length];
    const length = Math.hypot(bx - ax, bz - az) || 1;
    let [nx, nz] = [(bz - az) / length, -(bx - ax) / length];
    if (nx * (cx - (ax + bx) / 2) + nz * (cz - (az + bz) / 2) < 0) [nx, nz] = [-nx, -nz];
    if (nx <= 0 && nz <= 0) return;
    const quad = k.pathOf([at([ax, y, az]), at([bx, y, bz]), at([bx, y - depth, bz]), at([ax, y - depth, az])], true);
    if (nz >= nx) tops.push(quad);
    else sides[Math.min(3, Math.max(0, Math.floor(((nx * -sinA + 1) / 2) * 4)))].push(quad);
  });
  const shape = flat(x0, z0, x1, z1, r);
  return [
    `<clipPath id="${id}"><path transform="${planeOf(y)}" d="${shape}"/></clipPath>`,
    `<g clip-path="url(#${id})">`,
    `<path class="iso-top" d="${tops.join("")}"/>`,
    ...sides.map((d, shade) => (d.length ? `<path class="iso-shade" data-shade="${shade}" d="${d.join("")}"/>` : "")),
    `<g transform="${planeOf(y - depth)}"><path class="${backClass}" d="${shape}"/>${back}<path class="iso-line" data-tone="faint" d="${shape}"/></g>`,
    `</g>`,
    `<g transform="${planeOf(y)}"><path class="iso-line" data-tone="lo" d="${shape}"/></g>`,
  ].join("");
}

function plate() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 22))) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(PLATE, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  const strip = { x: -40, y: PLATE.y + PLATE.d - 15, w: 140, d: 7, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y + 0.8, 0.6, [2, 3.6], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  return out.join("");
}

// The tray: a floor, a tall back wall, a low front wall and two end walls.
function trayBack() {
  const out = [`<path class="iso-halo" d="${k.haloOf(TRAY, 0, 6, P)}"/>`];
  out.push(S(k.slabOf(TRAY, 0, TRAY_Z, P, 3, 0.6), { tone: "lo" }));
  out.push(S(k.slabOf({ x: TRAY.x, y: TRAY.y, w: TRAY.w, d: 3, r: 1 }, TRAY_Z, 20, P, 3, 0.4), { tone: "mid" }));
  out.push(S(k.slabOf({ x: TRAY.x, y: TRAY.y, w: 3, d: TRAY.d, r: 1 }, TRAY_Z, 14, P, 3, 0.4), { tone: "mid" }));
  // Slot rules on the floor: one per card, plus the empty slot
  out.push(L([...CARD_X, MISSING_X].map((x) => k.lineOnTop([x, TRAY.y + 4], [x, TRAY.y + TRAY.d - 4], TRAY_Z, P)).join(""), { tone: "faint", free: true }));
  return out.join("");
}

function cards() {
  return byDepth(CARD_X.map((x, i) => [x, CARD.y, i]))
    .map(([x, , i]) => {
      const body = { x: x - CARD.t / 2, y: CARD.y, w: CARD.t, d: CARD.d, r: 0.4 };
      const tab = { x: x - CARD.t / 2, y: CARD.y + 3 + i * 6, w: CARD.t, d: 9, r: 0.4 };
      return `<g data-card="${i}">${S(k.slabOf(body, CARD.z0, CARD.z1 - CARD.z0, P, 2), { tone: "hi", crease: "lo" })}${S(k.slabOf(tab, CARD.z1, 4, P, 2), { tone: "hi", crease: "lo" })}</g>`;
    })
    .join("");
}

function trayFront() {
  const out = [];
  out.push(S(k.slabOf({ x: TRAY.x + TRAY.w - 3, y: TRAY.y, w: 3, d: TRAY.d, r: 1 }, TRAY_Z, 14, P, 3, 0.4), { tone: "mid" }));
  out.push(S(k.slabOf({ x: TRAY.x, y: TRAY.y + TRAY.d - 3, w: TRAY.w, d: 3, r: 1 }, TRAY_Z, 9, P, 3, 0.4), { tone: "mid" }));
  return out.join("");
}

function post(x, y) {
  return [
    S(k.cylinder(x, y, 4, 0, 2, P, 20), { tone: "lo" }),
    S(k.slabOf({ x: x - 2.2, y: y - 2.2, w: 4.4, d: 4.4, r: 1 }, 2, RAIL_Z - 2, P, 3), { tone: "mid", crease: "none" }),
  ].join("");
}

function rail(y) {
  const out = [];
  {
    out.push(S(k.slabOf({ x: POSTS_X[0] - 3, y: y - 2, w: POSTS_X[1] - POSTS_X[0] + 6, d: 4, r: 1 }, RAIL_Z, 3, P, 3, 0.4), { tone: "mid" }));
    const t = k.topTicks(POSTS_X[0] + 6, POSTS_X[1] - 6, 4, 5, y - 2 + 0.6, RAIL_Z + 3, [1.2, 2.2], P);
    out.push(L(t.minor, { tone: "faint" }), L(t.major, { tone: "lo" }));
  }
  return out.join("");
}

// The probe hangs under the carriage between the rails, so it is drawn before the front rail.
function probe() {
  const z0 = CARRIAGE.z0;
  return `<g data-probe-wrap><g data-probe>${S(k.slabOf({ x: -1.4, y: PROBE_Y - 1.4, w: 2.8, d: 2.8, r: 1 }, CARD.z1 + 6, z0 - CARD.z1 - 6, P, 3), { tone: "lo", crease: "none" })}${S(k.cylinder(0, PROBE_Y, 2.4, CARD.z1 + 4.4, 1.6, P, 16), { tone: "hi", lit: true })}</g></g>`;
}

// The carriage, built centred on x = 0 and moved along x by the live code.
function carriage() {
  const { w, y, d, z0, h } = CARRIAGE;
  const out = [];
  out.push(S(k.slabOf({ x: -w / 2, y, w, d, r: 2 }, z0, h, P, 4, 0.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan({ x: -w / 2, y, w, d, r: 2 }, 2.5), z0 + h, P, 4), { tone: "faint" }));
  out.push(D(k.corners({ x: -w / 2, y, w, d, r: 2 }, 3).map(([x, yy]) => at([x, yy, z0 + h])), { size: 0.45 }));
  out.push(S(k.cylinder(0, y + d / 2, 3.2, z0 + h, 2.4, P, 20), { tone: "mid" }));
  out.push(L(k.knurl(0, y + d / 2, 3.2, z0 + h, z0 + h + 2.4, 18, P), { tone: "lo" }));
  return `<g data-carriage>${out.join("")}</g>`;
}

function outbox() {
  const out = [`<path class="iso-halo" d="${k.haloOf(OUTBOX, 0, 4, P)}"/>`];
  out.push(S(k.slabOf(OUTBOX, 0, OUT_H, P, 4, 0.6), { tone: "mid" }));
  const slot = { x: OUTBOX.x + OUTBOX.w / 2 - 1.6, y: OUTBOX.y + 4, w: 3.2, d: OUTBOX.d - 8, r: 1 };
  out.push(`<path class="sl-dark" d="${k.pathOf(k.roundedPlan(slot, 3).map(([x, y]) => at([x, y, OUT_H])), true)}"/>`);
  out.push(L(k.planOutline(slot, OUT_H, P, 3), { tone: "lo" }));
  out.push(`<g class="sl-light" data-light>${D([at([OUTBOX.x + OUTBOX.w - 4, OUTBOX.y + OUTBOX.d - 4, OUT_H])], { size: 0.8, tone: "hi" })}</g>`);
  return out.join("");
}

// The copy that leaves: a card standing in the out slot, moved toward the viewer by the live code.
function copyCard() {
  const x = OUTBOX.x + OUTBOX.w / 2;
  const body = { x: x - CARD.t / 2, y: OUTBOX.y + 6, w: CARD.t, d: OUTBOX.d - 12, r: 0.4 };
  return `<g data-copy style="opacity:0">${S(k.slabOf(body, OUT_H, 18, P, 2), { tone: "hi", crease: "lo" })}</g>`;
}

function panel() {
  const out = [`<path class="iso-halo" d="${k.haloOf({ ...PANEL, y: PANEL.y - 8, d: 14 }, 0, 4, P)}"/>`];
  out.push(S(k.slabOf({ x: PANEL.x - 2, y: PANEL.y - 9, w: PANEL.w + 4, d: 15, r: 3 }, 0, 3, P, 4, 0.6), { tone: "mid" }));
  out.push(S(k.slabOf({ x: PANEL.x + 3, y: PANEL.y - 5, w: PANEL.w - 6, d: 3, r: 1 }, 3, PANEL_Z[0], P, 3), { tone: "lo" }));
  out.push(S(k.slabOf(PANEL, PANEL_Z[0], PANEL_Z[1] - PANEL_Z[0], P, 4, 0.5), { tone: "mid" }));
  const screen = { x0: PANEL.x + 3, x1: PANEL.x + PANEL.w - 3, z0: PANEL_Z[0] + 3, z1: PANEL_Z[1] - 3, r: 1.2, depth: 0.8 };
  const cx = (screen.x0 + screen.x1) / 2;
  const back = [
    `<text class="sl-file" data-file x="${cx}" y="${-(screen.z0 + 16)}" font-size="6.2" text-anchor="middle">index.html</text>`,
    `<text class="sl-status" data-status-text x="${cx}" y="${-(screen.z0 + 6.4)}" font-size="4.8" text-anchor="middle">Waiting</text>`,
  ].join("");
  out.push(recess(screen, PANEL.y + PANEL.d, back, "sl-screen"));
  return out.join("");
}

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "The inside of a server, drawn as a machine. A tray holds four file cards. A picker carriage runs on rails above them. When a file is asked for, the carriage moves to its card, lowers a probe, and a copy of the card leaves through the out tray. If there is no card for that file, the display shows 404 Not Found.",
  body: [
    plate(),
    `<g data-key="cards">${trayBack()}</g>`,
    `<g data-key="picker">${post(POSTS_X[0], RAIL_Y[0])}${post(POSTS_X[1], RAIL_Y[0])}</g>`,
    `<g data-key="cards">${cards()}${trayFront()}</g>`,
    `<g data-key="picker">${rail(RAIL_Y[0])}${probe()}${rail(RAIL_Y[1])}${carriage()}${post(POSTS_X[0], RAIL_Y[1])}${post(POSTS_X[1], RAIL_Y[1])}</g>`,
    `<g data-key="out">${outbox()}${copyCard()}</g>`,
    `<g data-key="display">${panel()}</g>`,
  ],
});

const META = {
  x: k.axisVector(P, [1, 0, 0]),
  down: k.axisVector(P, [0, 0, -1]),
  toward: k.axisVector(P, [0, 1, 0]),
  slots: [...CARD_X, MISSING_X],
  drop: PROBE_DROP,
  travel: COPY_TRAVEL,
};

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "art.generated.ts"), `// Generated by figures/server-lookup/build.mjs. Do not edit by hand.\nexport const FIG_SVG = ${JSON.stringify(svg)};\nexport const FIG_META = ${JSON.stringify(META)};\n`);

const live = readFileSync(join(OUT, "live.mjs"), "utf8").replace(/^import .*$/gm, "").replace(/^export /gm, "");
const css = readFileSync(join(OUT, "figure.css"), "utf8") + readFileSync(join(ROOT, "src", "components", "figures", "hero", "hero.css"), "utf8").split("/* On the landing page")[0];
const body =
  `<style>${css}</style>` +
  k.plateHtml({ fig: "Fig 1.2", title: "Inside the server", hint: "Ask for a file", readout: "4 files stored", keys: [], caption: "", body: `<div class="iso-stage sl-stage" tabindex="0">${svg}</div>` });
mkdirSync(join(HERE, "out"), { recursive: true });
writeFileSync(
  join(HERE, "out", "fig.html"),
  k.pageHtml({ title: "Fig 1.2", theme: "light", body, script: `document.body.classList.add("fe-figure");\n${live}\nmountServerLookup(document.querySelector(".iso-plate"), ${JSON.stringify(META)});` }),
);
console.log("wrote art.generated.ts and out/fig.html");
