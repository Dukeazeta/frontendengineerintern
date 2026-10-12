// Drives Fig 1.4. Tap a server and it slides out of the rack; the readout says which
// websites it keeps. The tour pulls each server out in turn. Returns a cleanup.
const SITES = [
  ["shop.example"],
  ["blog.example", "recipes.example"],
  ["news.example"],
  ["school.example", "photos.example", "games.example"],
  ["maps.example"],
  [],
];

export function mountDataCentre(root, meta) {
  const svg = root.querySelector("svg");
  if (!svg) return () => {};
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const readout = root.querySelector("[data-readout]");
  const status = root.querySelector("[data-status]");
  const buttons = [...root.querySelectorAll("[data-server-button]")];
  const servers = SITES.map((_, i) => svg.querySelector(`[data-server="${i}"]`));
  const lights = SITES.map((_, i) => svg.querySelector(`[data-light="${i}"]`));
  // A server that slides out passes in front of the rack's front posts, so it is drawn last
  // while it is out, then returned to its place in the stack.
  const homes = servers.map((el) => ({ parent: el.parentNode, next: el.nextSibling }));
  const raise = (i) => homes[i].parent.appendChild(servers[i]);
  const lower = (i) => homes[i].parent.insertBefore(servers[i], homes[i].next);

  const out = SITES.map(() => 0);
  let picked = -1;
  let touring = !still.matches;
  let next = 0;
  let idle = 1.4;

  function describe(i) {
    const list = SITES[i];
    if (!list.length) return `Server ${i + 1} is empty, ready for new websites`;
    return `Server ${i + 1} keeps ${list.length === 1 ? "1 website" : `${list.length} websites`}: ${list.join(", ")}`;
  }

  function pick(i, announce = true) {
    picked = picked === i ? -1 : i;
    if (picked >= 0) raise(picked);
    const text = picked < 0 ? "6 servers in this rack" : describe(picked);
    if (readout) readout.textContent = text;
    if (announce && status) status.textContent = text;
    buttons.forEach((el, n) => el.setAttribute("aria-pressed", String(n === picked)));
    run();
  }

  function render() {
    servers.forEach((el, i) => {
      const [dx, dy] = meta.slide;
      el.setAttribute("transform", `translate(${(dx * out[i]).toFixed(2)} ${(dy * out[i]).toFixed(2)})`);
      lights[i].toggleAttribute("data-on", i === picked);
    });
  }

  let raf = 0;
  let previous = 0;
  let visible = false;
  let idleTimer = 0;
  function tick(now) {
    const dt = previous ? Math.min((now - previous) / 1000, 1 / 30) : 1 / 60;
    previous = now;
    if (touring) {
      idle -= dt;
      if (idle <= 0) {
        pick(next, false);
        next = (next + 1) % SITES.length;
        idle = 2.6;
      }
    }
    let moving = false;
    out.forEach((v, i) => {
      const target = i === picked ? 1 : 0;
      const nv = still.matches ? target : v + (target - v) * (1 - Math.exp(-dt / 0.22));
      out[i] = Math.abs(nv - target) < 0.002 ? target : nv;
      if (out[i] !== target) moving = true;
      else if (target === 0 && servers[i].nextSibling !== homes[i].next) lower(i);
    });
    render();
    raf = visible && (touring || moving) ? requestAnimationFrame(tick) : 0;
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
    const el = event.target.closest("[data-server]");
    if (!el) return;
    takeOver();
    pick(Number(el.getAttribute("data-server")));
  }
  const handlers = buttons.map((el) => {
    const handler = () => {
      takeOver();
      pick(Number(el.getAttribute("data-server-button")));
    };
    el.addEventListener("click", handler);
    return handler;
  });
  svg.addEventListener("click", onClick);
  const observer = new IntersectionObserver(
    (entries) => {
      visible = entries[entries.length - 1].isIntersecting;
      if (visible) run();
    },
    { rootMargin: "80px 0px" },
  );
  observer.observe(svg);

  render();
  if (readout) readout.textContent = "6 servers in this rack";
  root.dataset.ready = "true";

  return () => {
    delete root.dataset.ready;
    cancelAnimationFrame(raf);
    clearTimeout(idleTimer);
    observer.disconnect();
    svg.removeEventListener("click", onClick);
    buttons.forEach((el, i) => el.removeEventListener("click", handlers[i]));
  };
}
