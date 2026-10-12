// Drives Fig 1.2. Ask for a file: the picker runs to its slot and lowers its probe.
// A card there means a copy leaves through the out tray; an empty slot means 404 Not Found.
export function mountServerLookup(root, meta) {
  const svg = root.querySelector("svg");
  if (!svg) return () => {};
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const readout = root.querySelector("[data-readout]");
  const status = root.querySelector("[data-status]");
  const buttons = [...root.querySelectorAll("[data-file-button]")];
  const FILES = ["index.html", "style.css", "app.js", "photo.jpg", "missing.html"];

  const carriage = svg.querySelector("[data-carriage]");
  const probe = svg.querySelector("[data-probe]");
  const probeWrap = svg.querySelector("[data-probe-wrap]");
  const copy = svg.querySelector("[data-copy]");
  const light = svg.querySelector("[data-light]");
  const fileText = svg.querySelector("[data-file]");
  const statusText = svg.querySelector("[data-status-text]");

  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const clamp = (t) => Math.min(1, Math.max(0, t));
  const lerp = (a, b, t) => a + (b - a) * t;

  let x = meta.slots[0];
  let job = null; // { file, from, t }

  const MOVE = 0.9;
  const DOWN = 0.35;
  const UP = 0.3;
  const SEND = 0.9;

  function place(probeDrop, copyAt, copyOpacity) {
    const along = `translate(${(meta.x[0] * x).toFixed(2)} ${(meta.x[1] * x).toFixed(2)})`;
    carriage.setAttribute("transform", along);
    probeWrap.setAttribute("transform", along);
    const d = probeDrop * meta.drop;
    probe.setAttribute("transform", `translate(${(meta.down[0] * d).toFixed(2)} ${(meta.down[1] * d).toFixed(2)})`);
    const c = copyAt * meta.travel;
    copy.setAttribute("transform", `translate(${(meta.toward[0] * c).toFixed(2)} ${(meta.toward[1] * c).toFixed(2)})`);
    copy.style.opacity = copyOpacity.toFixed(3);
  }

  function show(file, state) {
    fileText.textContent = file;
    statusText.textContent = state === "found" ? "Found, sending a copy" : state === "missing" ? "404 Not Found" : "Looking";
    if (state) statusText.setAttribute("data-tone", state);
    else statusText.removeAttribute("data-tone");
  }

  function say(text) {
    if (readout && readout.textContent !== text) readout.textContent = text;
  }

  function ask(i, announce = true) {
    if (job) return;
    job = { file: i, from: x, t: still.matches ? MOVE + DOWN + UP + SEND : 0 };
    show(FILES[i], null);
    say(`Asked for ${FILES[i]}`);
    if (announce && status) status.textContent = `Asking the server for ${FILES[i]}.`;
    run();
  }

  function frame() {
    if (!job) {
      place(0, 0, 0);
      return;
    }
    const { file, from } = job;
    const target = meta.slots[file];
    const hit = file < 4;
    let t = job.t;
    if (t < MOVE) {
      x = lerp(from, target, ease(t / MOVE));
      place(0, 0, 0);
      return;
    }
    x = target;
    t -= MOVE;
    if (t < DOWN) {
      place(ease(t / DOWN), 0, 0);
      return;
    }
    t -= DOWN;
    if (t < UP) {
      place(1 - ease(t / UP), 0, 0);
      if (t === 0 || !statusText.hasAttribute("data-tone")) show(FILES[file], hit ? "found" : "missing");
      return;
    }
    t -= UP;
    show(FILES[file], hit ? "found" : "missing");
    light.toggleAttribute("data-on", hit);
    if (hit) {
      const k = clamp(t / SEND);
      place(0, ease(k), k < 0.15 ? k / 0.15 : 1 - clamp((k - 0.7) / 0.3));
    } else {
      place(0, 0, 0);
    }
  }

  function finish() {
    const hit = job.file < 4;
    const file = FILES[job.file];
    job = null;
    light.toggleAttribute("data-on", false);
    show(file, hit ? "found" : "missing");
    say(hit ? `${file} found, copy sent` : `${file} · 404 Not Found`);
    if (status) status.textContent = hit ? `${file} was found. The server sent a copy.` : `${file} does not exist. The server answered 404 Not Found.`;
    place(0, 0, 0);
  }

  let raf = 0;
  let previous = 0;
  let visible = false;

  function tick(now) {
    const dt = previous ? Math.min((now - previous) / 1000, 1 / 30) : 1 / 60;
    previous = now;
    if (job) {
      job.t += dt;
      if (job.t >= MOVE + DOWN + UP + SEND) finish();
    }
    frame();
    raf = visible && job ? requestAnimationFrame(tick) : 0;
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
  function onKey(event) {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const i = ["1", "2", "3", "4", "5"].indexOf(event.key);
    if (i < 0) return;
    event.preventDefault();
    ask(i);
  }
  const handlers = buttons.map((el) => {
    const handler = () => ask(Number(el.getAttribute("data-file-button")));
    el.addEventListener("click", handler);
    return handler;
  });
  root.addEventListener("keydown", onKey);
  const observer = new IntersectionObserver(
    (entries) => {
      visible = entries[entries.length - 1].isIntersecting;
      if (visible) run();
    },
    { rootMargin: "80px 0px" },
  );
  observer.observe(svg);

  show("No file yet", null);
  statusText.textContent = "Pick a file to ask for";
  say("4 files stored");
  frame();
  root.dataset.ready = "true";

  return () => {
    delete root.dataset.ready;
    cancelAnimationFrame(raf);
    observer.disconnect();
    root.removeEventListener("keydown", onKey);
    buttons.forEach((el, i) => el.removeEventListener("click", handlers[i]));
  };
}
