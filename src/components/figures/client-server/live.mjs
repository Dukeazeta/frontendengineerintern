// Drives Fig 1.1. A request has three steps: the client asks, the server finds the files,
// and copies travel back. Device buttons play a whole request; the step list in the text
// (window event "fei:step") plays one step at a time and pauses. Returns a cleanup.
export function mountClientServer(root, meta) {
  const svg = root.querySelector("svg");
  if (!svg) return () => {};
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const readout = root.querySelector("[data-readout]");
  const status = root.querySelector("[data-status]");
  const buttons = [...root.querySelectorAll("[data-ask]")];
  const NAMES = ["phone", "tablet", "monitor"];
  const FIG = "1.1";

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

  // The request timeline in seconds, slow enough to follow while reading.
  const LEGS = { out: 1.1, up: 0.8, serve: 1.6, down: 0.8, back: 1.1 };
  const END = [LEGS.out + LEGS.up, LEGS.out + LEGS.up + LEGS.serve, LEGS.out + LEGS.up + LEGS.serve + LEGS.down + LEGS.back];
  const START = [0, END[0], END[1]];
  const TOTAL = END[2];
  const stepOf = (t) => (t < END[0] ? 0 : t < END[1] ? 1 : 2);
  const LINES = [
    (name) => `1 · The ${name} asks the server for the page`,
    () => "2 · The server finds the page’s files",
    (name) => `3 · Copies travel back to the ${name}`,
  ];

  let served = 0;
  let current = 0; // the device the step list drives
  let job = null; // { client, t, stopAt, paused }

  const busy = () => job && !job.paused;
  const say = (text) => {
    if (readout && readout.textContent !== text) readout.textContent = text;
  };
  const announce = (step) => window.dispatchEvent(new CustomEvent("fei:step-active", { detail: { fig: FIG, step } }));

  function narrate(step) {
    const line = LINES[step](NAMES[job.client]);
    say(line);
    announce(step);
    if (status) status.textContent = `${line.slice(4)}.`;
  }

  function along(path, t, reverse) {
    const p = path.getPointAtLength((reverse ? 1 - t : t) * lengths.get(path));
    pulse.setAttribute("cx", p.x.toFixed(2));
    pulse.setAttribute("cy", p.y.toFixed(2));
  }

  function setDrawer(i, amount) {
    const [dx, dy] = meta.drawerVec;
    drawers[i].setAttribute("transform", `translate(${(dx * amount).toFixed(2)} ${(dy * amount).toFixed(2)})`);
  }

  function frame() {
    ports.forEach((el) => el.toggleAttribute("data-on", false));
    activity.toggleAttribute("data-on", false);
    drawers.forEach((_, i) => setDrawer(i, 0));
    pulse.toggleAttribute("data-back", false);
    pulse.style.opacity = "0";
    if (!job) return;
    const cable = cables[job.client];
    let s = job.t;
    pulse.style.opacity = "1";
    if (s < LEGS.out) return along(cable, ease(s / LEGS.out), true);
    s -= LEGS.out;
    ports[job.client].toggleAttribute("data-on", true);
    if (s < LEGS.up) return along(serverCable, ease(s / LEGS.up), false);
    s -= LEGS.up;
    if (s < LEGS.serve) {
      pulse.style.opacity = "0";
      activity.toggleAttribute("data-on", true);
      ports[3].toggleAttribute("data-on", true);
      drawers.forEach((_, i) => setDrawer(i, Math.sin(clamp((s - i * 0.18) / (LEGS.serve - 0.36)) * Math.PI)));
      return;
    }
    s -= LEGS.serve;
    pulse.toggleAttribute("data-back", true);
    if (s < LEGS.down) {
      ports[3].toggleAttribute("data-on", true);
      return along(serverCable, ease(s / LEGS.down), true);
    }
    s -= LEGS.down;
    ports[job.client].toggleAttribute("data-on", true);
    along(cable, ease(clamp(s / LEGS.back)), false);
  }

  // Play steps [from .. to] of a request from one device.
  function play(client, from, to) {
    current = client;
    if (!job || job.client !== client || !job.paused || stepOf(job.t - 0.0001) !== from - 1) {
      job = { client, t: START[from], stopAt: END[to], paused: false };
      pages[client].style.opacity = "0";
      waits[client].style.opacity = "1";
    } else {
      job.t = START[from];
      job.stopAt = END[to];
      job.paused = false;
    }
    if (still.matches) job.t = job.stopAt - 0.0001;
    narrate(stepOf(job.t));
    run();
  }

  function finish() {
    const i = job.client;
    job = null;
    served += 1;
    waits[i].style.opacity = "0";
    pages[i].style.opacity = "1";
    say(`The page is on the ${NAMES[i]} · ${served} served`);
    announce(3);
    if (status) status.textContent = `The page arrived on the ${NAMES[i]}.`;
  }

  function onStep(event) {
    const { fig, step } = event.detail || {};
    if (fig !== FIG || busy()) return;
    play(current, step, step);
  }

  let raf = 0;
  let previous = 0;
  let visible = false;
  function tick(now) {
    const dt = previous ? Math.min((now - previous) / 1000, 1 / 30) : 1 / 60;
    previous = now;
    if (busy()) {
      const before = stepOf(job.t);
      job.t = Math.min(job.t + dt, job.stopAt);
      if (job.t >= TOTAL) finish();
      else if (job.t >= job.stopAt) {
        job.paused = true;
        say(`${LINES[before](NAMES[job.client])} · paused`);
      } else if (stepOf(job.t) !== before) narrate(stepOf(job.t));
    }
    frame();
    raf = visible && busy() ? requestAnimationFrame(tick) : 0;
  }
  function run() {
    if (still.matches) {
      tick(performance.now());
      return;
    }
    if (!raf && visible) {
      previous = 0;
      raf = requestAnimationFrame(tick);
    }
  }

  const ask = (i) => {
    if (!busy()) play(i, 0, 2);
  };
  function onKey(event) {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const i = ["1", "2", "3"].indexOf(event.key);
    if (i < 0) return;
    event.preventDefault();
    ask(i);
  }
  const handlers = buttons.map((el) => {
    const handler = () => ask(Number(el.getAttribute("data-ask")));
    el.addEventListener("click", handler);
    return handler;
  });
  function onClick(event) {
    const el = event.target.closest("[data-client]");
    if (el) ask(Number(el.getAttribute("data-client")));
  }

  svg.addEventListener("click", onClick);
  root.addEventListener("keydown", onKey);
  window.addEventListener("fei:step", onStep);
  const observer = new IntersectionObserver(
    (entries) => {
      visible = entries[entries.length - 1].isIntersecting;
      if (visible) run();
    },
    { rootMargin: "80px 0px" },
  );
  observer.observe(svg);

  // Rest state: every screen shows its page, so the figure reads before anyone touches it.
  pages.forEach((el) => (el.style.opacity = "1"));
  say("Pick a device to send a request");
  frame();
  root.dataset.ready = "true";

  return () => {
    delete root.dataset.ready;
    cancelAnimationFrame(raf);
    observer.disconnect();
    svg.removeEventListener("click", onClick);
    root.removeEventListener("keydown", onKey);
    window.removeEventListener("fei:step", onStep);
    buttons.forEach((el, i) => el.removeEventListener("click", handlers[i]));
  };
}
