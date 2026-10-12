import { LAYOUT } from "./layout.mjs";

// Drives Fig 0. Three switches (HTML, CSS, JavaScript) each add a layer to the
// page on the monitor. Returns a cleanup function.
export function mountHero(root) {
  const svg = root.querySelector("svg");
  if (!svg) return () => {};
  const $ = (selector) => svg.querySelector(selector);
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const readout = root.querySelector("[data-readout]");
  const status = root.querySelector("[data-status]");
  const buttons = [...root.querySelectorAll("[data-switch-button]")];
  const NAMES = ["HTML", "CSS", "JavaScript"];

  const textEls = ["nav0", "nav1", "nav2", "h1", "p0", "p1", "p2"].map((name) => [name, $(`[data-el="${name}"]`)]);
  const boxEls = ["img", "button", "toast"].map((name) => [name, $(`[data-el="${name}"]`)]);
  const layer = $('[data-layer="html"]');
  const rule = $('[data-el="rule"]');
  const img = $('[data-el="img"]');
  const button = $('[data-el="button"]');
  const toast = $('[data-el="toast"]');
  const count = $("[data-count]");
  const cursor = $('[data-el="cursor"]');
  const empty = $("[data-empty]");
  const poses = [0, 1, 2].map((i) => [svg.querySelector(`[data-switch="${i}"] [data-pose="on"]`), svg.querySelector(`[data-switch="${i}"] [data-pose="off"]`)]);
  const leds = [0, 1, 2].map((i) => svg.querySelector(`[data-led="${i}"]`));

  const on = [true, true, true];
  const level = { html: 1, css: 1, js: 1, toast: 1, press: 0 };
  let clicks = 1;
  const pointer = { x: 30, y: 60, show: 0, phase: "rest", clock: 0 };

  const lerp = (a, b, t) => a + (b - a) * t;
  const mix = (a, b, t) => a.map((v, i) => lerp(v ?? 0, b[i] ?? 0, t));
  const follow = (value, target, dt, seconds) => (still.matches ? target : value + (target - value) * (1 - Math.exp(-dt / seconds)));
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  function placeBox(name, el, t) {
    const [x, y, w, h] = mix(LAYOUT.html[name], LAYOUT.css[name], t);
    const [bw, bh] = LAYOUT.base[name];
    el.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${(w / bw).toFixed(4)} ${(h / bh).toFixed(4)})`);
  }

  function render() {
    const t = level.css;
    layer.style.opacity = level.html.toFixed(3);
    for (const [name, el] of textEls) {
      const [x, y, w, h, r] = mix(LAYOUT.html[name], LAYOUT.css[name], t);
      el.setAttribute("x", x.toFixed(2));
      el.setAttribute("y", y.toFixed(2));
      el.setAttribute("width", w.toFixed(2));
      el.setAttribute("height", h.toFixed(2));
      el.setAttribute("rx", r.toFixed(2));
    }
    for (const [name, el] of boxEls) placeBox(name, el, t);
    rule.style.opacity = t.toFixed(3);
    svg.style.setProperty("--fe-css", t.toFixed(3));
    img.querySelector("[data-art]").style.opacity = t.toFixed(3);
    img.querySelector("[data-cross]").style.opacity = (1 - t).toFixed(3);
    button.toggleAttribute("data-live", level.js > 0.5);
    button.style.setProperty("--fe-press", level.press.toFixed(3));
    toast.style.opacity = (level.js * level.toast).toFixed(3);
    cursor.style.opacity = (level.js * pointer.show).toFixed(3);
    cursor.setAttribute("transform", `translate(${pointer.x.toFixed(2)} ${pointer.y.toFixed(2)}) scale(${(1 - level.press * 0.12).toFixed(3)})`);
    empty.style.opacity = ((1 - level.html) * (on[1] || on[2] ? 1 : 0)).toFixed(3);
  }

  function say() {
    const n = on.filter(Boolean).length;
    let text = `${n} of 3 layers on`;
    if (on[0] && on[2]) text += ` · ${clicks} ${clicks === 1 ? "click" : "clicks"}`;
    if (!on[0] && (on[1] || on[2])) text = "Needs HTML first";
    if (readout && readout.textContent !== text) readout.textContent = text;
    empty.textContent = on[1] && on[2] ? "Nothing to style or run" : on[1] ? "CSS has nothing to style" : "JavaScript has nothing to run";
  }

  function setSwitch(i, value, announce = true) {
    if (on[i] === value) return;
    on[i] = value;
    poses[i][0].style.display = value ? "" : "none";
    poses[i][1].style.display = value ? "none" : "";
    leds[i].toggleAttribute("data-off", !value);
    if (buttons[i]) buttons[i].setAttribute("aria-pressed", String(value));
    if (i === 2 && !value) {
      pointer.phase = "rest";
      pointer.show = 0;
    }
    if (announce && status) status.textContent = `${NAMES[i]} ${value ? "on" : "off"}.`;
    say();
    run();
  }

  function press() {
    if (!on[0] || !on[2]) return;
    clicks += 1;
    count.textContent = `Clicked ${clicks} ${clicks === 1 ? "time" : "times"}`;
    level.press = 1;
    level.toast = Math.max(level.toast, 0.001);
    say();
    run();
  }

  // The idle tour: switch everything off, then build the page up one layer at a time.
  const TOUR = [
    [3.2, () => setSwitch(2, false, false)],
    [0.6, () => setSwitch(1, false, false)],
    [0.6, () => setSwitch(0, false, false)],
    [1.4, () => setSwitch(0, true, false)],
    [2.0, () => setSwitch(1, true, false)],
    [2.4, () => { setSwitch(2, true, false); pointer.phase = "enter"; pointer.clock = 0; }],
    [7.5, () => {}],
  ];
  let touring = !still.matches;
  let step = 0;
  let wait = TOUR[0][0];
  let idleTimer = 0;

  function tourTick(dt) {
    wait -= dt;
    if (wait > 0) return;
    TOUR[step][1]();
    step = (step + 1) % TOUR.length;
    wait = TOUR[step][0];
  }

  // The pointer JavaScript uses to show a click: it glides to the button and presses it twice.
  function pointerTick(dt) {
    if (!touring || !on[2] || !on[0]) return;
    pointer.clock += dt;
    const target = LAYOUT.css.button;
    const bx = lerp(LAYOUT.html.button[0], target[0], level.css) + 18;
    const by = lerp(LAYOUT.html.button[1], target[1], level.css) + 5;
    if (pointer.phase === "enter") {
      const k = ease(Math.min(1, pointer.clock / 1.2));
      pointer.x = lerp(140, bx, k);
      pointer.y = lerp(78, by, k);
      pointer.show = Math.min(1, pointer.clock / 0.3);
      if (pointer.clock >= 1.2) { pointer.phase = "click"; pointer.clock = 0; press(); }
    } else if (pointer.phase === "click") {
      pointer.x = bx;
      pointer.y = by;
      if (pointer.clock >= 1.6) { pointer.phase = "again"; pointer.clock = 0; press(); }
    } else if (pointer.phase === "again" && pointer.clock >= 2) {
      pointer.phase = "leave";
      pointer.clock = 0;
    } else if (pointer.phase === "leave") {
      pointer.show = Math.max(0, 1 - pointer.clock / 0.5);
      if (pointer.show === 0) pointer.phase = "rest";
    }
  }

  let frame = 0;
  let previous = 0;
  let visible = false;
  function tick(now) {
    const dt = previous ? Math.min((now - previous) / 1000, 1 / 30) : 1 / 60;
    previous = now;
    if (touring) tourTick(dt);
    pointerTick(dt);
    level.html = follow(level.html, on[0] ? 1 : 0, dt, 0.28);
    level.css = follow(level.css, on[1] ? 1 : 0, dt, 0.32);
    level.js = follow(level.js, on[2] ? 1 : 0, dt, 0.25);
    level.press = follow(level.press, 0, dt, 0.18);
    if (level.toast > 0 && level.toast < 1) level.toast = follow(level.toast, 1, dt, 0.2);
    render();
    const settled =
      Math.abs(level.html - (on[0] ? 1 : 0)) < 0.002 &&
      Math.abs(level.css - (on[1] ? 1 : 0)) < 0.002 &&
      Math.abs(level.js - (on[2] ? 1 : 0)) < 0.002 &&
      level.press < 0.002 &&
      (level.toast === 0 || level.toast > 0.998);
    const busy = touring || !settled || pointer.phase !== "rest";
    frame = visible && busy ? requestAnimationFrame(tick) : 0;
  }
  function run() {
    if (!frame && visible) {
      previous = 0;
      frame = requestAnimationFrame(tick);
    }
  }

  function takeOver() {
    touring = false;
    pointer.phase = "rest";
    pointer.show = 0;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (still.matches) return;
      touring = true;
      step = 0;
      wait = TOUR[0][0];
      for (let i = 0; i < 3; i++) setSwitch(i, true, false);
      run();
    }, 12000);
  }

  function onClick(event) {
    const sw = event.target.closest("[data-switch]");
    if (sw) {
      takeOver();
      const i = Number(sw.getAttribute("data-switch"));
      setSwitch(i, !on[i]);
      return;
    }
    if (event.target.closest('[data-el="button"]')) {
      takeOver();
      press();
    }
  }
  function onKey(event) {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const i = ["1", "2", "3"].indexOf(event.key);
    if (i < 0) return;
    event.preventDefault();
    takeOver();
    setSwitch(i, !on[i]);
  }
  const buttonHandlers = buttons.map((el, i) => {
    const handler = () => {
      takeOver();
      setSwitch(i, !on[i]);
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
  const onMotion = () => {
    if (still.matches) {
      touring = false;
      for (let i = 0; i < 3; i++) setSwitch(i, true, false);
    }
    run();
  };
  still.addEventListener("change", onMotion);

  say();
  render();

  return () => {
    cancelAnimationFrame(frame);
    clearTimeout(idleTimer);
    observer.disconnect();
    still.removeEventListener("change", onMotion);
    svg.removeEventListener("click", onClick);
    root.removeEventListener("keydown", onKey);
    buttons.forEach((el, i) => el.removeEventListener("click", buttonHandlers[i]));
  };
}
