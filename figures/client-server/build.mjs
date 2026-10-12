// Fig 1: client and server. A server cabinet with file drawers, a network hub,
// and three client devices (phone, tablet, monitor) cabled together on a bench.
// A client asks; the request runs to the server; a drawer opens; the files run
// back and the client's screen fills with the page.
//
// node figures/client-server/build.mjs
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../kit/iso-kit.mjs";
import * as G from "../kit/lathe.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT = join(ROOT, "src", "components", "figures", "client-server");

const WIDTH = 640;
const HEIGHT = 440;

const PLATE = { x: -132, y: -78, w: 264, d: 172, r: 10 };
const PLATE_H = 10;
const FOOT_H = 5;

// Server cabinet, front face toward +y
const RACK = { x: -120, y: -66, w: 58, d: 44, r: 3 };
const RACK_FRONT = RACK.y + RACK.d;
const RACK_Z0 = 4;
const RACK_TOP = 104;
const DRAWERS = [0, 1, 2].map((i) => ({ x0: RACK.x + 7, x1: RACK.x + RACK.w - 7, z0: 62 - i * 20, z1: 78 - i * 20 }));
const DRAWER_OUT = 7;

// Hub
const HUB = { x: -32, y: -64, w: 46, d: 20, r: 2.5 };
const HUB_H = 11;
const HUB_FRONT = HUB.y + HUB.d;

// Clients, screens facing +y
const CLIENTS = [
  { name: "phone", body: { x: -50, y: 60, w: 20, d: 3, r: 2.5 }, z0: 9, z1: 47, screen: { inset: 2.2, top: 4.5, bottom: 4.5 }, stand: "prop" },
  { name: "tablet", body: { x: -6, y: 54, w: 50, d: 3, r: 3 }, z0: 9, z1: 45, screen: { inset: 3, top: 3, bottom: 3 }, stand: "prop" },
  { name: "monitor", body: { x: 70, y: 34, w: 58, d: 5, r: 2.5 }, z0: 26, z1: 66, screen: { inset: 3, top: 3, bottom: 6 }, stand: "neck" },
];

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), ...k.boxCorners(RACK, 0, RACK_TOP), ...k.boxCorners({ x: 70, y: 34, w: 58, d: 5, r: 0 }, 0, 66)],
  WIDTH,
  HEIGHT,
  { pad: 22, azimuth: 58 },
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
function recess({ x0, x1, z0, z1, r, depth }, y, back = "", backClass = "cs-well", inside = "") {
  const id = `cs-clip-${clips++}`;
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
  const strip = { x: -40, y: PLATE.y + PLATE.d - 15, w: 150, d: 7, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y + 0.8, 0.6, [2, 3.6], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  const label = { x: -124, y: PLATE.y + PLATE.d - 18, w: 40, d: 10, r: 1.2 };
  out.push(S(k.slabOf(label, 0, 0.8, P, 3), { tone: "lo", crease: "none" }));
  out.push(L(k.planOutline(k.insetPlan(label, 1.6), 0.8, P, 3), { tone: "faint" }));
  out.push(L([28, 20, 12].map((w, i) => k.lineOnTop([label.x + 4, label.y + 3 + i * 2.2], [label.x + 4 + w, label.y + 3 + i * 2.2], 0.8, P)).join(""), { tone: "lo", free: true }));
  out.push(D([at([label.x + label.w - 3, label.y + 2.6, 0.8]), at([label.x + label.w - 3, label.y + label.d - 2.6, 0.8])], { size: 0.45 }));
  return out.join("");
}

// The server cabinet with three file drawers that slide out when serving.
function rack() {
  const out = [`<path class="iso-halo" d="${k.haloOf(RACK, 0, 8, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(RACK, 6))) out.push(S(k.cylinder(x, y, 3, 0, RACK_Z0, P, 16), { tone: "lo" }));
  out.push(S(k.slabOf(RACK, RACK_Z0, RACK_TOP - RACK_Z0, P, 4, 1.2), { tone: "mid", inner: L(k.sideSeam(RACK, RACK_TOP - 8, P, 4), { tone: "faint" }) }));
  // Top vents
  out.push(L(Array.from({ length: 8 }, (_, i) => k.planOutline({ x: RACK.x + 8, y: RACK.y + 6 + i * 4.4, w: RACK.w - 16, d: 1.6, r: 0.8 }, RACK_TOP, P, 4)).join(""), { tone: "faint" }));
  // Front panel recess and status lights
  out.push(`<g transform="${planeOf(RACK_FRONT)}"><path class="iso-line" data-tone="faint" d="${flat(RACK.x + 3, RACK_Z0 + 4, RACK.x + RACK.w - 3, RACK_TOP - 4, 2)}"/></g>`);
  out.push(D([at([RACK.x + 9, RACK_FRONT, RACK_TOP - 12])], { size: 0.8, tone: "hi" }));
  out.push(`<g class="cs-activity" data-part="activity">${D([at([RACK.x + 14, RACK_FRONT, RACK_TOP - 12])], { size: 0.8, tone: "hi" })}</g>`);
  out.push(`<g transform="${planeOf(RACK_FRONT)}">${L(Array.from({ length: 10 }, (_, i) => flat(RACK.x + 24 + i * 3, RACK_TOP - 15, RACK.x + 25.2 + i * 3, RACK_TOP - 9, 0.6, 3)).join(""), { tone: "lo" })}</g>`);
  // Drawers, each a group the live code slides along +y
  DRAWERS.forEach((dw, i) => {
    out.push(recess({ ...dw, r: 1.5, depth: 2 }, RACK_FRONT, "", "cs-dark"));
    const front = { x: dw.x0 + 0.8, y: RACK_FRONT - 2, w: dw.x1 - dw.x0 - 1.6, d: 2.8, r: 0.8 };
    const g = [];
    g.push(S(k.slabOf(front, dw.z0 + 0.8, dw.z1 - dw.z0 - 1.6, P, 3, 0.4), { tone: "hi" }));
    const label = { x0: (dw.x0 + dw.x1) / 2 - 10, x1: (dw.x0 + dw.x1) / 2 + 10, z0: dw.z1 - 7, z1: dw.z1 - 3 };
    g.push(`<g transform="${planeOf(front.y + front.d)}"><path class="iso-line" data-tone="lo" d="${flat(label.x0, label.z0, label.x1, label.z1, 0.6, 3)}"/>${L(`M${label.x0 + 2.4} ${-(label.z0 + 2)}H${label.x0 + 2.4 + [11, 8, 13][i]}`, { tone: "mid", free: true })}</g>`);
    // Pull handle: two posts and a bar on the drawer face
    const hz = dw.z0 + 5.4;
    const cx = (dw.x0 + dw.x1) / 2;
    g.push(S(k.slabOf({ x: cx - 8, y: front.y + front.d, w: 2, d: 2.4, r: 0.6 }, hz - 1, 2, P, 2), { tone: "mid" }));
    g.push(S(k.slabOf({ x: cx + 6, y: front.y + front.d, w: 2, d: 2.4, r: 0.6 }, hz - 1, 2, P, 2), { tone: "mid" }));
    g.push(S(k.slabOf({ x: cx - 8.4, y: front.y + front.d + 2.4, w: 16.8, d: 1.6, r: 0.8 }, hz - 1, 2, P, 3), { tone: "mid" }));
    out.push(`<g data-drawer="${i}">${g.join("")}</g>`);
  });
  // Network port on the right side, where the hub cable lands
  const side = RACK.x + RACK.w;
  out.push(S(k.slabOf({ x: side - 0.4, y: -52, w: 1.4, d: 8, r: 1 }, 10, 7, P, 3), { tone: "lo" }));
  out.push(S(k.slabOf({ x: side + 1, y: -51, w: 3.4, d: 6, r: 1 }, 11, 5, P, 3, 0.3), { tone: "mid" }));
  return out.join("");
}

// The hub: a low box with four port lights.
function hub() {
  const out = [`<path class="iso-halo" d="${k.haloOf(HUB, 0, 4, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(HUB, 4))) out.push(S(k.cylinder(x, y, 2, 0, 1.4, P, 14), { tone: "lo" }));
  out.push(S(k.slabOf(HUB, 1.4, HUB_H - 1.4, P, 3, 0.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(HUB, 3), HUB_H, P, 3), { tone: "faint" }));
  [0, 1, 2, 3].forEach((i) => {
    const x = HUB.x + 7 + i * 10.5;
    out.push(recess({ x0: x - 3, x1: x + 3, z0: 3.4, z1: 7.4, r: 0.6, depth: 1.6 }, HUB_FRONT, "", "cs-dark"));
    out.push(`<g class="cs-port" data-port="${i}">${D([at([x + 3.2 + 0.9, HUB_FRONT, 8.4])], { size: 0.6, tone: "hi" })}</g>`);
  });
  return out.join("");
}

// Cable routes: from each hub port, along the bench, to the back of each client. Port 3 goes to the server.
const PORT_X = [0, 1, 2, 3].map((i) => HUB.x + 7 + i * 10.5);
function routes() {
  const lift = 1.4;
  const backOf = (c) => [c.body.x + c.body.w / 2, c.body.y - 0.2, c.stand === "neck" ? 10 : 6];
  const list = CLIENTS.map((c, i) => {
    const [bx, by, bz] = backOf(c);
    const px = PORT_X[i];
    return G.fillet(
      [
        [px, HUB_FRONT + 3, 5.4],
        [px, HUB_FRONT + 7, 5.4],
        [px, HUB_FRONT + 7, lift],
        [px, by - 12 - i * 3, lift],
        [bx, by - 12 - i * 3, lift],
        [bx, by - 6, lift],
        [bx, by - 6, bz],
        [bx, by, bz],
      ],
      4,
      7,
    );
  });
  const hy = HUB.y + HUB.d / 2;
  const right = HUB.x + HUB.w;
  const serverRoute = G.fillet(
    [
      [right + 3.6, hy, 5.4],
      [right + 8, hy, 5.4],
      [right + 8, hy, lift],
      [right + 8, HUB.y - 6, lift],
      [RACK.x + RACK.w + 8, HUB.y - 6, lift],
      [RACK.x + RACK.w + 8, -48, lift],
      [RACK.x + RACK.w + 8, -48, 13.5],
      [RACK.x + RACK.w + 4.4, -48, 13.5],
    ],
    4,
    7,
  );
  return { list, serverRoute };
}
const ROUTES = routes();
const cablePath = (route) => k.pathOf(route.map((p) => at(p)));

function cables() {
  const out = [];
  // Plugs seated in the three client ports
  out.push(S(k.slabOf({ x: HUB.x + HUB.w, y: HUB.y + HUB.d / 2 - 2.4, w: 3.6, d: 4.8, r: 0.6 }, 3.6, 3.6, P, 2, 0.3), { tone: "mid" }));
  PORT_X.slice(0, 3).forEach((px) => out.push(S(k.slabOf({ x: px - 2.4, y: HUB_FRONT, w: 4.8, d: 3, r: 0.6 }, 3.6, 3.6, P, 2, 0.3), { tone: "mid" })));
  ROUTES.list.forEach((route, i) => out.push(`<path class="iso-line cs-cord" data-tone="mid" data-cable="${i}" d="${cablePath(route)}"/>`));
  out.push(`<path class="iso-line cs-cord" data-tone="mid" data-cable="server" d="${cablePath(ROUTES.serverRoute)}"/>`);
  return out.join("");
}

// What a served page looks like on each screen, in face-plane units.
function pageArt(x0, z1, w, h) {
  const u = (v) => v * w;
  const v = (n) => n * h;
  const y = (n) => -(z1 - v(n));
  return [
    `<rect class="cs-bar" x="${x0 + u(0.08)}" y="${y(0.1)}" width="${u(0.5)}" height="${v(0.09)}" rx="${v(0.03)}"/>`,
    `<rect class="cs-line" x="${x0 + u(0.08)}" y="${y(0.28)}" width="${u(0.78)}" height="${v(0.04)}"/>`,
    `<rect class="cs-line" x="${x0 + u(0.08)}" y="${y(0.36)}" width="${u(0.66)}" height="${v(0.04)}"/>`,
    `<rect class="cs-img" x="${x0 + u(0.08)}" y="${y(0.48)}" width="${u(0.84)}" height="${v(0.3)}" rx="${v(0.03)}"/>`,
    `<rect class="cs-button" x="${x0 + u(0.08)}" y="${y(0.84)}" width="${u(0.3)}" height="${v(0.08)}" rx="${v(0.04)}"/>`,
  ].join("");
}

function client(c, i) {
  const { body, z0, z1 } = c;
  const out = [`<path class="iso-halo" d="${k.haloOf({ ...body, y: body.y - 6, d: body.d + 12 }, 0, 4, P)}"/>`];
  const cx = body.x + body.w / 2;
  if (c.stand === "neck") {
    const foot = { x: cx - 16, y: body.y - 14, w: 32, d: 24, r: 5 };
    out.push(S(k.slabOf(foot, 0, 3, P, 6, 0.6), { tone: "mid" }));
    out.push(S(k.slabOf({ x: cx - 4, y: body.y - 6, w: 8, d: 5, r: 1.5 }, 3, z0 + 10, P, 3), { tone: "mid", crease: "none" }));
  } else {
    const base = { x: body.x - 2, y: body.y - 8, w: body.w + 4, d: 14, r: 3 };
    out.push(S(k.slabOf(base, 0, 3, P, 4, 0.6), { tone: "mid" }));
    out.push(S(k.slabOf({ x: body.x + 1, y: body.y + body.d, w: body.w - 2, d: 3, r: 1 }, 3, z0 - 3 + 2.4, P, 3), { tone: "lo" }));
    out.push(S(k.slabOf({ x: cx - 3, y: body.y - 6, w: 6, d: 4, r: 1 }, 3, z0 + 8, P, 3), { tone: "lo", crease: "none" }));
  }
  const front = body.y + body.d;
  out.push(S(k.slabOf(body, z0, z1 - z0, P, 4, 0.5), { tone: "mid" }));
  const s = c.screen;
  const glass = { x0: body.x + s.inset, x1: body.x + body.w - s.inset, z0: z0 + s.bottom, z1: z1 - s.top, r: 1.2, depth: 0.8 };
  const pw = glass.x1 - glass.x0;
  const ph = glass.z1 - glass.z0;
  const back = [
    `<g class="cs-page" data-page="${i}" style="opacity:0">${pageArt(glass.x0, glass.z1, pw, ph)}</g>`,
    `<g class="cs-wait" data-wait="${i}" style="opacity:0"><circle cx="${(glass.x0 + glass.x1) / 2}" cy="${-(glass.z0 + ph / 2)}" r="${Math.min(pw, ph) * 0.1}"/></g>`,
  ].join("");
  out.push(recess(glass, front, back, "cs-glass"));
  if (c.name === "monitor") out.push(D([at([body.x + body.w - 5, front, z0 + 3])], { size: 0.7, tone: "hi" }));
  if (c.name === "phone") out.push(L(`M${at([cx - 3, front, z1 - 2.2]).join(" ")}L${at([cx + 3, front, z1 - 2.2]).join(" ")}`, { tone: "lo", free: true }));
  return `<g class="cs-client" data-client="${i}" role="button">${out.join("")}</g>`;
}

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "A small network on a bench. A server cabinet with three file drawers stands at the back, cabled to a hub. Three clients, a phone, a tablet and a monitor, are cabled to the same hub. When a client asks for a page, a dot travels along its cable to the server, a drawer slides out, the files travel back, and the page appears on that client's screen.",
  body: [plate(), rack(), hub(), cables(), ...byDepth(CLIENTS.map((c, i) => [c.body.x + c.body.w / 2, c.body.y, i])).map(([, , i]) => client(CLIENTS[i], i)), `<circle class="cs-pulse" data-pulse r="2.2" cx="0" cy="0" style="opacity:0"/>`],
});

const unit = k.axisVector(P, [0, 1, 0]);
const META = { drawerVec: [unit[0] * DRAWER_OUT, unit[1] * DRAWER_OUT] };

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "art.generated.ts"), `// Generated by figures/client-server/build.mjs. Do not edit by hand.\nexport const FIG_SVG = ${JSON.stringify(svg)};\nexport const FIG_META = ${JSON.stringify({ drawerVec: META.drawerVec })};\n`);

const live = readFileSync(join(OUT, "live.mjs"), "utf8").replace(/^import .*$/gm, "").replace(/^export /gm, "");
const css = readFileSync(join(OUT, "figure.css"), "utf8") + readFileSync(join(ROOT, "src", "components", "figures", "hero", "hero.css"), "utf8").split("/* On the landing page")[0];
const body =
  `<style>${css}</style>` +
  k.plateHtml({
    fig: "Fig 1.1",
    title: "Client and server",
    hint: "Tap a device",
    readout: "3 clients, 1 server",
    keys: [],
    caption: "",
    body: `<div class="iso-stage cs-stage" tabindex="0">${svg}</div>`,
  });
mkdirSync(join(HERE, "out"), { recursive: true });
writeFileSync(
  join(HERE, "out", "fig.html"),
  k.pageHtml({
    title: "Fig 1",
    theme: "light",
    body,
    script: `document.body.classList.add("fe-figure");\nconst FIG_META = ${JSON.stringify({ drawerVec: META.drawerVec })};\n${live}\nmountClientServer(document.querySelector(".iso-plate"), FIG_META);`,
  }),
);
console.log("wrote art.generated.ts and out/fig.html");
