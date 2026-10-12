// Fig 1.3: one page, many files. A server and a monitor joined by a pneumatic tube.
// Each capsule is one request: it goes up empty and comes back with one file. The page
// on the monitor builds up as the files arrive: HTML, then CSS, JavaScript and a photo.
//
// node figures/many-files/build.mjs
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../kit/iso-kit.mjs";
import * as G from "../kit/lathe.mjs";
import { helpers } from "../lib.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT = join(ROOT, "src", "components", "figures", "many-files");

const WIDTH = 640;
const HEIGHT = 440;

const PLATE = { x: -124, y: -62, w: 248, d: 142, r: 10 };
const SERVER = { x: -108, y: -50, w: 46, d: 38, r: 3 };
const SERVER_TOP = 82;
const SERVER_FRONT = SERVER.y + SERVER.d;
const MON = { x: -26, y: 30, w: 86, d: 6, r: 2.5 };
const MON_Z = [24, 80];
const MON_FRONT = MON.y + MON.d;
const STATION = { x: 70, y: 22, w: 30, d: 30, r: 3 };
const STATION_H = 30;
const TUBE_Z = 104;
const TUBE_R = 3.4;
const PORT_SERVER = [SERVER.x + SERVER.w / 2, SERVER.y + SERVER.d / 2];
const PORT_STATION = [STATION.x + STATION.w / 2, STATION.y + STATION.d / 2];
const POSTS = [[-30, PORT_SERVER[1]], [40, PORT_SERVER[1]]];

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -15, 0), ...k.boxCorners({ x: -110, y: -52, w: 214, d: 110, r: 0 }, 0, TUBE_Z + 6)],
  WIDTH,
  HEIGHT,
  { pad: 22, azimuth: 56 },
);
const { at, S, L, D, byDepth, planeOf, flat, recess, plate } = helpers(P, "mf");

function server() {
  const out = [`<path class="iso-halo" d="${k.haloOf(SERVER, 0, 8, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(SERVER, 5))) out.push(S(k.cylinder(x, y, 2.6, 0, 3, P, 16), { tone: "lo" }));
  out.push(S(k.slabOf(SERVER, 3, SERVER_TOP - 3, P, 4, 1.2), { tone: "mid", inner: L(k.sideSeam(SERVER, SERVER_TOP - 7, P, 4), { tone: "faint" }) }));
  out.push(L(Array.from({ length: 6 }, (_, i) => k.planOutline({ x: SERVER.x + 6, y: SERVER.y + 5 + i * 4.4, w: SERVER.w - 12, d: 1.6, r: 0.8 }, SERVER_TOP, P, 4)).join(""), { tone: "faint" }));
  // Four file lights, one per file this page needs
  out.push(`<g transform="${planeOf(SERVER_FRONT)}"><path class="iso-line" data-tone="faint" d="${flat(SERVER.x + 3, 7, SERVER.x + SERVER.w - 3, SERVER_TOP - 4, 2)}"/></g>`);
  [0, 1, 2, 3].forEach((i) => {
    const z = SERVER_TOP - 20 - i * 13;
    out.push(recess({ x0: SERVER.x + 8, x1: SERVER.x + SERVER.w - 8, z0: z - 4.5, z1: z + 4.5, r: 1.2, depth: 1.4 }, SERVER_FRONT, L(`M${SERVER.x + 12} ${-z}H${SERVER.x + 12 + [14, 10, 12, 16][i]}`, { tone: "lo", free: true }), "mf-dark"));
    out.push(`<g class="mf-light" data-light="${i}">${D([at([SERVER.x + SERVER.w - 5, SERVER_FRONT, z])], { size: 0.8, tone: "hi" })}</g>`);
  });
  // Tube port on top
  out.push(S(k.cylinder(PORT_SERVER[0], PORT_SERVER[1], TUBE_R + 2.4, SERVER_TOP, 2, P, 24), { tone: "lo" }));
  out.push(S(k.cylinder(PORT_SERVER[0], PORT_SERVER[1], TUBE_R + 1.2, SERVER_TOP + 2, 4, P, 24, 0.3), { tone: "mid" }));
  return out.join("");
}

function post([x, y]) {
  return [
    S(k.cylinder(x, y, 4.2, 0, 2, P, 20), { tone: "lo" }),
    S(k.cylinder(x, y, 1.8, 2, TUBE_Z - TUBE_R - 2.4 - 2, P, 16), { tone: "mid", crease: "none" }),
    S(k.cylinder(x, y, TUBE_R + 1.4, TUBE_Z - TUBE_R - 2.4, 2.4, P, 20), { tone: "mid" }),
  ].join("");
}

const ROUTE = G.fillet(
  [
    [PORT_SERVER[0], PORT_SERVER[1], SERVER_TOP + 6],
    [PORT_SERVER[0], PORT_SERVER[1], TUBE_Z],
    [PORT_STATION[0], PORT_SERVER[1], TUBE_Z],
    [PORT_STATION[0], PORT_STATION[1], TUBE_Z],
    [PORT_STATION[0], PORT_STATION[1], STATION_H + 6],
  ],
  12,
  10,
);
const tubeD = k.pathOf(ROUTE.map((p) => at(p)));

function tube() {
  return [
    `<path class="mf-tube-edge" d="${tubeD}"/>`,
    `<path class="mf-tube" d="${tubeD}"/>`,
    `<path class="mf-tube-shine" d="${tubeD}"/>`,
    `<path class="mf-route" data-route d="${tubeD}"/>`,
  ].join("");
}

function station() {
  const out = [`<path class="iso-halo" d="${k.haloOf(STATION, 0, 6, P)}"/>`];
  out.push(S(k.slabOf(STATION, 0, STATION_H, P, 4, 0.8), { tone: "mid" }));
  out.push(S(k.cylinder(PORT_STATION[0], PORT_STATION[1], TUBE_R + 2.4, STATION_H, 2, P, 24), { tone: "lo" }));
  out.push(S(k.cylinder(PORT_STATION[0], PORT_STATION[1], TUBE_R + 1.2, STATION_H + 2, 4, P, 24, 0.3), { tone: "mid" }));
  const front = STATION.y + STATION.d;
  const screen = { x0: STATION.x + 3, x1: STATION.x + STATION.w - 3, z0: 12, z1: 25, r: 1, depth: 0.8 };
  const cx = (screen.x0 + screen.x1) / 2;
  out.push(
    recess(
      screen,
      front,
      `<text class="mf-file" data-file x="${cx}" y="${-19}" font-size="3.4" text-anchor="middle">ready</text><text class="mf-count" data-count x="${cx}" y="${-14.4}" font-size="2.6" text-anchor="middle">0 of 4</text>`,
      "mf-screen",
    ),
  );
  out.push(recess({ x0: STATION.x + 6, x1: STATION.x + STATION.w - 6, z0: 3, z1: 8, r: 1, depth: 2 }, front, "", "mf-dark"));
  return out.join("");
}

// The page the files build, drawn in the monitor's face plane (x right, y down from the glass top).
function page(x0, z1, w, h) {
  const X = (u) => x0 + u * w;
  const Y = (v) => -(z1 - v * h);
  const r = (u, v, uw, vh, attrs = "") => `<rect x="${X(u)}" y="${Y(v)}" width="${uw * w}" height="${vh * h}"${attrs}/>`;
  return [
    // 1 · HTML: plain text, no layout
    `<g class="mf-layer" data-layer="0" style="opacity:0">${r(0.06, 0.08, 0.4, 0.06, ' class="mf-ink"')}${r(0.06, 0.2, 0.86, 0.03, ' class="mf-ink"')}${r(0.06, 0.26, 0.8, 0.03, ' class="mf-ink"')}${r(0.06, 0.32, 0.6, 0.03, ' class="mf-ink"')}${r(0.06, 0.42, 0.18, 0.07, ' class="mf-outline"')}</g>`,
    // 2 · CSS: a styled header band and a tinted panel
    `<g class="mf-layer" data-layer="1" style="opacity:0">${r(0, 0, 1, 0.06, ' class="mf-band"')}${r(0.52, 0.46, 0.42, 0.44, ' class="mf-panel" rx="1"')}</g>`,
    // 3 · JavaScript: the button comes alive
    `<g class="mf-layer" data-layer="2" style="opacity:0">${r(0.06, 0.42, 0.18, 0.07, ' class="mf-button" rx="1.4"')}</g>`,
    // 4 · The photo
    `<g class="mf-layer" data-layer="3" style="opacity:0"><rect x="${X(0.54)}" y="${Y(0.49)}" width="${0.38 * w}" height="${0.38 * h}" class="mf-photo" rx="1"/><circle cx="${X(0.84)}" cy="${Y(0.58)}" r="${0.05 * h}" class="mf-sun"/><path class="mf-hill" d="M${X(0.54)} ${Y(0.87)} L${X(0.66)} ${Y(0.66)} L${X(0.75)} ${Y(0.78)} L${X(0.82)} ${Y(0.7)} L${X(0.92)} ${Y(0.87)} Z"/></g>`,
  ].join("");
}

function monitor() {
  const out = [`<path class="iso-halo" d="${k.haloOf({ ...MON, y: MON.y - 14, d: 26 }, 0, 6, P)}"/>`];
  const cx = MON.x + MON.w / 2;
  const foot = { x: cx - 18, y: MON.y - 16, w: 36, d: 26, r: 6 };
  out.push(S(k.slabOf(foot, 0, 3, P, 6, 0.6), { tone: "mid" }));
  out.push(S(k.slabOf({ x: cx - 4.5, y: MON.y - 7, w: 9, d: 6, r: 2 }, 3, MON_Z[0] + 12, P, 3), { tone: "mid", crease: "none" }));
  out.push(S(k.slabOf(MON, MON_Z[0], MON_Z[1] - MON_Z[0], P, 4, 0.6), { tone: "mid" }));
  const bezel = { x0: MON.x + 3, x1: MON.x + MON.w - 3, z0: MON_Z[0] + 5, z1: MON_Z[1] - 3, r: 1.5, depth: 1 };
  const w = bezel.x1 - bezel.x0;
  const h = bezel.z1 - bezel.z0;
  out.push(recess(bezel, MON_FRONT, page(bezel.x0, bezel.z1, w, h), "mf-glass"));
  out.push(D([at([MON.x + MON.w - 5, MON_FRONT, MON_Z[0] + 2.5])], { size: 0.7, tone: "hi" }));
  return `<g data-monitor>${out.join("")}</g>`;
}

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "A server and a monitor joined by a pneumatic tube held up on two posts. Each capsule is one request. It travels up empty, a light on the server shows which file it is getting, and it comes back with that file. The page on the monitor builds up as the files arrive: first the HTML, then the CSS, the JavaScript and a photo.",
  body: [
    plate(PLATE),
    server(),
    post(POSTS[0]),
    post(POSTS[1]),
    tube(),
    monitor(),
    station(),
    `<circle class="mf-capsule" data-capsule r="3.6" cx="0" cy="0" style="opacity:0"/>`,
  ],
});

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "art.generated.ts"), `// Generated by figures/many-files/build.mjs. Do not edit by hand.\nexport const FIG_SVG = ${JSON.stringify(svg)};\n`);

const live = readFileSync(join(OUT, "live.mjs"), "utf8").replace(/^import .*$/gm, "").replace(/^export /gm, "");
const css = readFileSync(join(OUT, "figure.css"), "utf8") + readFileSync(join(ROOT, "src", "components", "figures", "hero", "hero.css"), "utf8").split("/* On the landing page")[0];
const body = `<style>${css}</style>` + k.plateHtml({ fig: "Fig 1.2", title: "One page, many files", hint: "Load the page", readout: "One page, 4 requests", keys: [], caption: "", body: `<div class="iso-stage mf-stage" tabindex="0">${svg}</div>` });
mkdirSync(join(HERE, "out"), { recursive: true });
writeFileSync(join(HERE, "out", "fig.html"), k.pageHtml({ title: "Fig 1.3", theme: "light", body, script: `document.body.classList.add("fe-figure");\n${live}\nmountManyFiles(document.querySelector(".iso-plate"));` }));
console.log("wrote art.generated.ts and out/fig.html");
