// Drives Fig 1. A client asks; the request travels to the server; drawers open;
// the files travel back and the page appears on that client. Returns a cleanup.
export function mountClientServer(root, meta) {
  const svg = root.querySelector("svg");
  if (!svg) return () => {};
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const readout = root.querySelector("[data-readout]");
  const status = root.querySelector("[data-status]");
  const buttons = [...root.querySelectorAll("[data-ask]")];
  const NAMES = ["phone", "tablet", "monitor"];

  const pulse = svg.querySelector("[data-pulse]");
  const cables = [0, 1, 2].map((i) => svg.querySelector(`[data-cable="${i}"]`));
  const serverCable = svg.querySelector('[data-cable="server"]');
  const pages = [0, 1, 2].map((i) => svg.querySelector(`[data-page="${i}"]`));
  const waits = [0, 1, 2].map((i) => svg.querySelector(`[data-wait="${i}"]`));
  const ports = [0, 1, 2, 3].map((i) => svg.querySelector(`[data-port="${i}"]`));
  const drawers = [0, 1, 2].map((i) => svg.querySelector(`[data-drawer="${i}"]`));
  const activity = svg.querySelector('[data-part="activity"]');

  const lengths = new Map([...cables, serverCable].map((path) => [path, path.getTotalLength()]));
  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const clamp = (t) => Math.min(1, Math.max(0, t));

  // One request, as a timeline in seconds.
  const LEGS = { out: 0.8, up: 0.6, serve: 1.1, down: 0.6, back: 0.8 };
  const TOTAL = LEGS.out + LEGS.up + LEGS.serve + LEGS.down + LEGS.back;

  let served = 0;
  let job = null; // { client, t }
  const shown = [0, 0, 0];

  function say() {
    let text = served ? `${served} ${served === 1 ? "page" : "pages"} served` : "3 clients, 1 server";
    if (job) text = job.t < LEGS.out + LEGS.up ? `The ${NAMES[job.client]} asks` : job.t < LEGS.out + LEGS.up + LEGS.serve ? "The server finds the files" : "The files travel back";
    if (readout && readout.textContent !== text) readout.textContent = text;
  }

  function along(path, t, reverse) {
    const len = lengths.get(path);
    const p = path.getPointAtLength((reverse ? 1 - t : t) * len);
    pulse.setAttribute("cx", p.x.toFixed(2));
    pulse.setAttribute("cy", p.y.toFixed(2));
  }

  function setDrawer(i, amount) {
    const [dx, dy] = meta.drawerVec;
    drawers[i].setAttribute("transform", `translate(${(dx * amount).toFixed(2)} ${(dy * amount).toFixed(2)})`);
  }

  function frame() {
    if (!job) {
      pulse.style.opacity = "0";
      activity.toggleAttribute("data-on", false);
      ports.forEach((el) => el.toggleAttribute("data-on", false));
      drawers.forEach((_, i) => setDrawer(i, 0));
      return;
    }
    const { client, t } = job;
    let s = t;
    const cable = cables[client];
    pulse.style.opacity = "1";
    pulse.toggleAttribute("data-back", false);
    ports.forEach((el) => el.toggleAttribute("data-on", false));
    activity.toggleAttribute("data-on", false);
    drawers.forEach((_, i) => setDrawer(i, 0));
    if (s < LEGS.out) {
      along(cable, ease(s / LEGS.out), true);
      return;
    }
    s -= LEGS.out;
    ports[client].toggleAttribute("data-on", true);
    if (s < LEGS.up) {
      along(serverCable, ease(s / LEGS.up), false);
      return;
    }
    s -= LEGS.up;
    if (s < LEGS.serve) {
      pulse.style.opacity = "0";
      activity.toggleAttribute("data-on", true);
      ports[3].toggleAttribute("data-on", true);
      drawers.forEach((_, i) => {
        const local = clamp((s - i * 0.14) / (LEGS.serve - 0.28));
        setDrawer(i, Math.sin(local * Math.PI));
      });
      return;
    }
    s -= LEGS.serve;
    pulse.toggleAttribute("data-back", true);
    if (s < LEGS.down) {
      ports[3].toggleAttribute("data-on", true);
      along(serverCable, ease(s / LEGS.down), true);
      return;
    }
    s -= LEGS.down;
    ports[client].toggleAttribute("data-on", true);
    along(cable, ease(clamp(s / LEGS.back)), false);
  }

  function ask(i, announce = true) {
    if (job) return false;
    job = { client: i, t: still.matches ? TOTAL : 0 };
    shown[i] = 0;
    pages[i].style.opacity = "0";
    waits[i].style.opacity = "1";
    if (announce && status) status.textContent = `The ${NAMES[i]} asks the server for a page.`;
    say();
    run();
    return true;
  }

  function finish() {
    const i = job.client;
    job = null;
    served += 1;
    shown[i] = 1;
    waits[i].style.opacity = "0";
    pages[i].style.opacity = "1";
    if (status) status.textContent = `The page arrived on the ${NAMES[i]}. ${served} served.`;
    say();
  }

  let touring = !still.matches;
  let next = 0;
  let idle = 1.2;
  let idleTimer = 0;
  let raf = 0;
  let previous = 0;
  let visible = false;

  function tick(now) {
    const dt = previous ? Math.min((now - previous) / 1000, 1 / 30) : 1 / 60;
    previous = now;
    if (job) {
      job.t += dt;
      if (job.t >= TOTAL) finish();
      else say();
    } else if (touring) {
      idle -= dt;
      if (idle <= 0) {
        if (shown.every(Boolean)) {
          shown.fill(0);
          pages.forEach((el) => (el.style.opacity = "0"));
          idle = 1.4;
        } else {
          ask(next, false);
          next = (next + 1) % 3;
          idle = 1.6;
        }
      }
    }
    frame();
    raf = visible && (job || touring) ? requestAnimationFrame(tick) : 0;
  }
  function run() {
    if (!raf && visible) {
      previous = 0;
      raf = requestAnimationFrame(tick);
    }
  }
  function takeOver() {
    touring = false;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (still.matches) return;
      touring = true;
      idle = 1;
      run();
    }, 12000);
  }

  function onClick(event) {
    const el = event.target.closest("[data-client]");
    if (!el) return;
    takeOver();
    ask(Number(el.getAttribute("data-client")));
  }
  function onKey(event) {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const i = ["1", "2", "3"].indexOf(event.key);
    if (i < 0) return;
    event.preventDefault();
    takeOver();
    ask(i);
  }
  const handlers = buttons.map((el) => {
    const handler = () => {
      takeOver();
      ask(Number(el.getAttribute("data-ask")));
    };
    el.addEventListener("click", handler);
    return handler;
  });

  svg.addEventListener("click", onClick);
  root.addEventListener("keydown", onKey);
  const observer = new IntersectionObserver(
    (entries) => {
      visible = entries[entries.length - 1].isIntersecting;
      if (visible) run();
    },
    { rootMargin: "80px 0px" },
  );
  observer.observe(svg);

  // Rest state: every screen already shows its page, so the figure reads without motion.
  served = 0;
  pages.forEach((el) => (el.style.opacity = "1"));
  shown.fill(1);
  if (touring) {
    shown.fill(0);
    pages.forEach((el) => (el.style.opacity = "0"));
  }
  say();
  frame();
  root.dataset.ready = "true";

  return () => {
    delete root.dataset.ready;
    cancelAnimationFrame(raf);
    clearTimeout(idleTimer);
    observer.disconnect();
    svg.removeEventListener("click", onClick);
    root.removeEventListener("keydown", onKey);
    buttons.forEach((el, i) => el.removeEventListener("click", handlers[i]));
  };
}
