// Shared drawing helpers for the course figures, bound to one projection.
import * as k from "./kit/iso-kit.mjs";

export function helpers(P, prefix) {
  const at = (point) => k.iso(point, P);
  const S = (paths, style) => k.solidSvg(paths, style);
  const L = (d, style) => k.lineSvg(d, style);
  const D = (points, style) => k.dotsSvg(points, style);
  const byDepth = (points) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
  const planeOf = (y) => k.sideMatrix([0, y], 0, P, "left");
  const flat = (x0, z0, x1, z1, r, steps = 6) =>
    k.pathOf(k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, steps).map(([u, z]) => [u, -z]), true);

  // A recess in a vertical face facing +y, with its inner walls shaded by facing.
  let clips = 0;
  function recess({ x0, x1, z0, z1, r, depth }, y, back = "", backClass = `${prefix}-well`) {
    const id = `${prefix}-clip-${clips++}`;
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

  // The bench plate every figure stands on, with feet, groove, corner screws and a ruler strip.
  function plate(PLATE, { ruler = true, H = 10, FOOT = 5 } = {}) {
    const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -H - FOOT, H, P)}"/>`];
    for (const [x, y] of byDepth(k.corners(PLATE, 22))) {
      out.push(S(k.cylinder(x, y, 7, -H - FOOT, 1.6, P, 28), { tone: "lo" }));
      out.push(S(k.cylinder(x, y, 5.4, -H - FOOT + 1.6, FOOT - 1.6, P, 28), { tone: "mid" }));
    }
    out.push(S(k.slabOf(PLATE, -H, H, P, 8, 1.6), { tone: "mid" }));
    out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
    const screws = k.corners(PLATE, 10);
    out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
    out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
    if (ruler) {
      const strip = { x: PLATE.x + PLATE.w * 0.35, y: PLATE.y + PLATE.d - 15, w: PLATE.w * 0.5, d: 7, r: 1 };
      out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
      const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y + 0.8, 0.6, [2, 3.6], P);
      out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
    }
    return out.join("");
  }

  return { at, S, L, D, byDepth, planeOf, flat, recess, plate };
}
