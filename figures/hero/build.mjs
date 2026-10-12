// Fig 0: a web page in three layers. A monitor on a bench plate, wired to a
// control deck with three toggle switches: HTML, CSS and JavaScript. Each
// switch adds one layer to the page on the screen.
//
// node figures/hero/build.mjs          writes the React art module and a preview page
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../kit/iso-kit.mjs";
import * as G from "../kit/lathe.mjs";
import { LAYOUT, PAGE } from "../../src/components/figures/hero/layout.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");

const WIDTH = 640;
const HEIGHT = 470;

// Bench plate
const PLATE = { x: -116, y: -80, w: 232, d: 176, r: 10 };
const PLATE_H = 10;
const FOOT_H = 5;

// Monitor
const FOOT = { x: -38, y: -66, w: 76, d: 46, r: 9 };
const NECK = { x: -7, y: -56, w: 14, d: 8, r: 2.5 };
const CASE = { x: -98, y: -46, w: 196, d: 11, r: 4 };
const FRONT = CASE.y + CASE.d;
const SIDE = CASE.x + CASE.w;
const CASE_Z0 = 30;
const CASE_TOP = 154;
const BEZEL = { x0: -92, x1: 92, z0: 40, z1: 148, r: 3, depth: 1.2 };
const GLASS = { x0: -89, x1: 89, z0: 43, z1: 145, r: 2, depth: 1.4 };
const PORT = { y: -40.5, z: 46 };

// Control deck
const DECK = { x: -66, y: 20, w: 120, d: 54, r: 6 };
const DECK_Z = 1.6;
const DECK_TOP = 17;
const SWITCH_X = [-44, -20, 4];
const SWITCH_Y = 50;
const LED_Y = 34;
const KNOB = { x: 34, y: 48, r: 6 };
const TILT = (24 * Math.PI) / 180;

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), ...k.boxCorners(CASE, CASE_Z0, CASE_TOP), ...k.boxCorners(DECK, 0, DECK_TOP + 14)],
  WIDTH,
  HEIGHT,
  { pad: 22, azimuth: 60 },
);

const at = (point) => k.iso(point, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const byDepth = (points) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
const planeOf = (y) => k.sideMatrix([0, y], 0, P, "left");
const flat = (x0, z0, x1, z1, r, steps = 6) =>
  k.pathOf(k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, steps).map(([u, z]) => [u, -z]), true);

// A recess in a vertical face, with its inner walls shaded by facing.
let clips = 0;
function recess({ x0, x1, z0, z1, r, depth }, y, back = "", backClass = "fe-well", inside = "") {
  const id = `fe-clip-${clips++}`;
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
    inside,
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
  // Ruler strip along the front edge
  const strip = { x: -104, y: PLATE.y + PLATE.d - 15, w: 150, d: 7, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y + 0.8, 0.6, [2, 3.6], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  // Label plate
  const label = { x: 66, y: PLATE.y + PLATE.d - 17, w: 40, d: 10, r: 1.2 };
  out.push(S(k.slabOf(label, 0, 0.8, P, 3), { tone: "lo", crease: "none" }));
  out.push(L(k.planOutline(k.insetPlan(label, 1.6), 0.8, P, 3), { tone: "faint" }));
  out.push(L([28, 20, 12].map((w, i) => k.lineOnTop([label.x + 4, label.y + 3 + i * 2.2], [label.x + 4 + w, label.y + 3 + i * 2.2], 0.8, P)).join(""), { tone: "lo", free: true }));
  out.push(D([at([label.x + label.w - 3, label.y + 2.6, 0.8]), at([label.x + label.w - 3, label.y + label.d - 2.6, 0.8])], { size: 0.45 }));
  return out.join("");
}

function stand() {
  const out = [`<path class="iso-halo" d="${k.haloOf(FOOT, 0, 6, P)}"/>`];
  out.push(S(k.slabOf(k.insetPlan(FOOT, 2), 0, 1.4, P, 8), { tone: "lo" }));
  out.push(S(k.slabOf(FOOT, 1.4, 3.6, P, 8, 0.8), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(FOOT, 4), 5, P, 8), { tone: "faint" }));
  // Neck rising from the foot to the hinge behind the case
  const collar = { x: NECK.x - 3, y: NECK.y - 3, w: NECK.w + 6, d: NECK.d + 6, r: 4 };
  out.push(S(k.slabOf(collar, 5, 4, P, 4, 0.5), { tone: "mid" }));
  out.push(D(k.corners(collar, 2.2).map(([x, y]) => at([x, y, 9])), { size: 0.45 }));
  out.push(S(k.slabOf(NECK, 9, CASE_Z0 + 40, P, 3), { tone: "mid", crease: "none" }));
  out.push(S(k.slabOf({ x: -13, y: CASE.y - 3, w: 26, d: 3, r: 1.5 }, CASE_Z0 + 34, 18, P, 3), { tone: "lo" }));
  return out.join("");
}

function screen() {
  const { w, h } = PAGE;
  const px = GLASS.x0 + 4;
  const pz = GLASS.z1 - 16;
  // Browser chrome: a tab bar with three dots and an address field
  const chrome = [
    `<path class="fe-chrome" d="${flat(GLASS.x0, GLASS.z1 - 13, GLASS.x1, GLASS.z1, 0.1)}"/>`,
    `<path class="iso-line" data-tone="faint" d="M${GLASS.x0} ${-(GLASS.z1 - 13)}H${GLASS.x1}"/>`,
    ...[0, 1, 2].map((i) => `<circle class="fe-dot" cx="${GLASS.x0 + 6 + i * 4.2}" cy="${-(GLASS.z1 - 6.5)}" r="1.25"/>`),
    `<path class="fe-address" d="${flat(-52, GLASS.z1 - 10, 52, GLASS.z1 - 3, 3.5)}"/>`,
    `<text class="fe-url" x="-46" y="${-(GLASS.z1 - 7.9)}" font-size="3.4">index.html</text>`,
  ].join("");

  // The page: every element is drawn once and moved by the live code.
  const el = (name, extra = "") => {
    const r = LAYOUT.css[name];
    return `<rect data-el="${name}" x="${r[0]}" y="${r[1]}" width="${r[2]}" height="${r[3]}" rx="${r[4] ?? 0}"${extra}/>`;
  };
  const page = [
    `<rect class="fe-page" x="0" y="0" width="${w}" height="${h}"/>`,
    `<g data-layer="html">`,
    `<line class="fe-rule" data-el="rule" x1="0" y1="${LAYOUT.ruleY}" x2="${w}" y2="${LAYOUT.ruleY}"/>`,
    ["nav0", "nav1", "nav2"].map((n) => el(n, ' class="fe-text"')).join(""),
    el("h1", ' class="fe-text"'),
    ["p0", "p1", "p2"].map((n) => el(n, ' class="fe-text"')).join(""),
    `<g data-el="img">`,
    `<rect class="fe-box" data-box x="0" y="0" width="66" height="46" rx="2"/>`,
    `<g class="fe-art" data-art><circle cx="50" cy="13" r="5"/><path d="M0 46 L20 24 L32 34 L44 20 L66 40 L66 46 Z"/></g>`,
    `<path class="fe-cross" data-cross d="M0 0 L66 46 M66 0 L0 46"/>`,
    `</g>`,
    `<g data-el="button">`,
    `<rect class="fe-button" data-box x="0" y="0" width="30" height="10" rx="5"/>`,
    `<rect class="fe-label" data-label x="8" y="4.1" width="14" height="1.8" rx="0.9"/>`,
    `</g>`,
    `<g data-el="toast" style="opacity:0">`,
    `<rect class="fe-toast" data-box x="0" y="0" width="56" height="10" rx="2"/>`,
    `<text class="fe-toast-text" data-count x="5" y="6.4" font-size="3.6">Clicked 1 time</text>`,
    `</g>`,
    `<path class="fe-cursor" data-el="cursor" style="opacity:0" d="M0 0 L0 9 L2.4 6.8 L4.2 10.6 L5.7 9.9 L3.9 6.2 L7 6.2 Z"/>`,
    `</g>`,
    `<text class="fe-empty" data-empty x="${w / 2}" y="${h / 2}" font-size="4" text-anchor="middle" style="opacity:0">Nothing to show yet</text>`,
  ].join("");

  const back = [
    chrome,
    `<g data-part="page" transform="translate(${px} ${-pz})">${page}</g>`,
  ].join("");
  return recess(BEZEL, FRONT, "", "fe-bezel", recess(GLASS, FRONT - BEZEL.depth, back, "fe-glass"));
}

function monitor() {
  const out = [];
  out.push(S(k.slabOf(CASE, CASE_Z0, CASE_TOP - CASE_Z0, P, 6, 1.2), { tone: "mid", inner: L(k.sideSeam(CASE, CASE_Z0 + 5, P, 6), { tone: "faint" }) }));
  // Vents on the top face and the right side
  out.push(L(Array.from({ length: 14 }, (_, i) => k.planOutline({ x: -66 + i * 9.6, y: CASE.y + 2.2, w: 5.6, d: 1.4, r: 0.7 }, CASE_TOP, P, 4)).join(""), { tone: "faint" }));
  const rowOf = (from, to, gap) => Array.from({ length: Math.floor((to - from) / gap + 1e-9) + 1 }, (_, i) => from + i * gap);
  out.push(L(rowOf(CASE_TOP - 50, CASE_TOP - 14, 3.2).map((z) => k.pathOf(k.roundedPlan({ x: CASE.y + 3, y: z - 0.7, w: CASE.d - 6, d: 1.4, r: 0.7 }, 4).map(([u, zz]) => at([SIDE, u, zz])), true)).join(""), { tone: "faint" }));
  out.push(screen());
  // Chin: power light
  out.push(`<g data-part="power">${D([at([BEZEL.x1 - 6, FRONT, CASE_Z0 + 5])], { size: 0.8, tone: "hi" })}</g>`);
  // Port on the right side, with the cable's plug in it
  out.push(S(k.slabOf({ x: SIDE - 0.4, y: PORT.y - 4, w: 1.4, d: 8, r: 1 }, PORT.z - 4, 8, P, 3), { tone: "lo" }));
  out.push(S(k.slabOf({ x: SIDE + 1, y: PORT.y - 3, w: 4.4, d: 6, r: 1 }, PORT.z - 3, 6, P, 3, 0.4), { tone: "mid" }));
  out.push(S(k.slabOf({ x: SIDE + 5.4, y: PORT.y - 1.6, w: 4.2, d: 3.2, r: 1.4 }, PORT.z - 1.6, 3.2, P, 4), { tone: "mid" }));
  out.push(D([at([SIDE + 3.2, PORT.y - 2, PORT.z + 3]), at([SIDE + 3.2, PORT.y + 2, PORT.z + 3])], { size: 0.4 }));
  return out.join("");
}

function cable() {
  const route = G.fillet(
    [
      [SIDE + 9.6, PORT.y, PORT.z],
      [SIDE + 14, PORT.y, PORT.z],
      [SIDE + 14, PORT.y, 1.4],
      [SIDE + 14, -6, 1.4],
      [DECK.x + DECK.w - 10, DECK.y - 10, 1.4],
      [DECK.x + DECK.w - 10, DECK.y - 1, 1.4],
    ],
    7,
    9,
  );
  return `<path class="iso-line fe-cord" data-tone="mid" d="${k.pathOf(route.map((p) => at(p)))}"/>`;
}

function toggle(x, on) {
  const tilt = on ? -TILT : TILT;
  const base = DECK_TOP + 1.4 + 3.6;
  const F = G.frameAlong([x, SWITCH_Y, base], [0, Math.sin(tilt), Math.cos(tilt)]);
  const bat = G.solidOf([[0, 1.15], [8.6, 0.85, 1], [9.6, 1.25, 1], [10.8, 1.3, 1], [11.8, 0.9, 1], [12.2, 0, 1]], F, P);
  return S(bat, { tone: "hi" });
}

function deck() {
  const out = [`<path class="iso-halo" d="${k.haloOf(DECK, 0, 8, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(DECK, 8))) out.push(S(k.cylinder(x, y, 3.2, 0, DECK_Z, P, 16), { tone: "lo" }));
  out.push(S(k.slabOf(k.insetPlan(DECK, 2), DECK_Z, 3, P, 6), { tone: "lo" }));
  out.push(S(k.slabOf(DECK, DECK_Z + 3, DECK_TOP - DECK_Z - 3, P, 6, 1), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(DECK, 4.5), DECK_TOP, P, 6), { tone: "lo" }));
  const screws = k.corners(DECK, 8.5);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 1.8, DECK_TOP, P, 14)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, DECK_TOP])), { size: 0.45 }));

  SWITCH_X.forEach((x, i) => {
    // Indicator light
    out.push(S(k.cylinder(x, LED_Y, 2.2, DECK_TOP, 0.8, P, 18), { tone: "lo" }));
    out.push(`<g class="fe-led" data-led="${i}">${S(k.cylinder(x, LED_Y, 1.4, DECK_TOP + 0.8, 0.9, P, 16), { tone: "hi" })}</g>`);
    // Nut and threaded bushing
    out.push(S(k.cylinder(x, SWITCH_Y, 4.6, DECK_TOP, 1.4, P, 6, 0.3), { tone: "lo" }));
    out.push(S(k.cylinder(x, SWITCH_Y, 2.7, DECK_TOP + 1.4, 3.6, P, 24), { tone: "mid", inner: L(k.sideArc(x, SWITCH_Y, 2.7, DECK_TOP + 3.2, P, 16), { tone: "faint" }) }));
    // The bat handle, built in both poses
    out.push(`<g class="fe-switch" data-switch="${i}">`);
    out.push(`<path class="fe-hit" d="${k.pathOf([at([x - 11, LED_Y - 6, DECK_TOP]), at([x + 11, LED_Y - 6, DECK_TOP]), at([x + 11, SWITCH_Y + 18, DECK_TOP]), at([x + 11, SWITCH_Y + 18, DECK_TOP + 20]), at([x - 11, SWITCH_Y - 4, DECK_TOP + 20])], true)}"/>`);
    out.push(`<g data-pose="on">${toggle(x, true)}</g><g data-pose="off" style="display:none">${toggle(x, false)}</g>`);
    out.push(`</g>`);
    // Label plate under the switch
    const plan = { x: x - 9, y: SWITCH_Y + 11, w: 18, d: 6.4, r: 1 };
    out.push(S(k.slabOf(plan, DECK_TOP, 0.6, P, 3), { tone: "lo", crease: "none" }));
    out.push(k.faceTextSvg(k.topMatrix([x, plan.y + 4.6], DECK_TOP + 0.6, P), ["HTML", "CSS", "JS"][i], { size: 3.4, tone: "hi", anchor: "middle" }));
  });

  // Knurled knob
  out.push(S(k.cylinder(KNOB.x, KNOB.y, KNOB.r + 1.4, DECK_TOP, 1, P, 28), { tone: "lo" }));
  out.push(S(k.cylinder(KNOB.x, KNOB.y, KNOB.r, DECK_TOP + 1, 5, P, 36, 0.4), { tone: "mid" }));
  out.push(L(k.knurl(KNOB.x, KNOB.y, KNOB.r, DECK_TOP + 1.4, DECK_TOP + 6, 36, P), { tone: "lo" }));
  out.push(L(k.lineOnTop([KNOB.x - 2.6, KNOB.y], [KNOB.x + 4.2, KNOB.y], DECK_TOP + 6, P), { tone: "hi", free: true }));
  out.push(L(k.radialTicks(KNOB.x, KNOB.y, KNOB.r + 3.4, 11, 5, DECK_TOP, [1, 1.8], P, -2.2, 4.4).minor, { tone: "lo", free: true }));
  return out.join("");
}

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "A monitor on a bench plate showing a small web page, wired to a control deck with three toggle switches. The switches are HTML, CSS and JavaScript. With only HTML on, the page is a plain stack of unstyled parts. CSS arranges and styles them into a layout. JavaScript makes the button work: a pointer clicks it and a message counts the clicks.",
  body: [plate(), stand(), monitor(), cable(), deck()],
});

// The React art module
const outDir = join(ROOT, "src", "components", "figures", "hero");
mkdirSync(outDir, { recursive: true });
writeFileSync(
  join(outDir, "art.generated.ts"),
  `// Generated by figures/hero/build.mjs. Do not edit by hand.\nexport const HERO_SVG = ${JSON.stringify(svg)};\n`,
);

// A standalone preview page for the anatomy capture and line checks
const live = readFileSync(join(outDir, "live.mjs"), "utf8").replace(/^import .*$/gm, "").replace(/^export /gm, "");
const css = readFileSync(join(outDir, "hero.css"), "utf8");
const layoutSrc = readFileSync(join(outDir, "layout.mjs"), "utf8").replace(/^export /gm, "");
const body =
  `<style>${css}</style>` +
  k.plateHtml({
    fig: "Fig 0",
    title: "A web page",
    hint: "Flip a switch",
    readout: "3 of 3 layers on",
    keys: [],
    caption: "",
    body: `<div class="iso-stage fe-hero" tabindex="0">${svg}</div>`,
  });
mkdirSync(join(HERE, "out"), { recursive: true });
writeFileSync(
  join(HERE, "out", "hero.html"),
  k.pageHtml({
    title: "Fig 0",
    theme: "light",
    body,
    script: `document.body.classList.add("fe-figure");\n${layoutSrc}\n${live}\nmountHero(document.querySelector(".iso-plate"));`,
  }),
);
console.log("wrote art.generated.ts and out/hero.html");
