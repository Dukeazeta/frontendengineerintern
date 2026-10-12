// Drives Fig 1.3. Loading one page takes four requests. Each capsule goes up the tube
// empty and comes back with one file; the page on the monitor builds up as files arrive.
export function mountManyFiles(root) {
  const svg = root.querySelector("svg");
  if (!svg) return () => {};
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const readout = root.querySelector("[data-readout]");
  const status = root.querySelector("[data-status]");
  const reload = root.querySelector("[data-reload]");
  const FILES = ["index.html", "style.css", "app.js", "photo.jpg"];

  const route = svg.querySelector("[data-route]");
  const capsule = svg.querySelector("[data-capsule]");
  const layers = [0, 1, 2, 3].map((i) => svg.querySelector(`[data-layer="${i}"]`));
  const lights = [0, 1, 2, 3].map((i) => svg.querySelector(`[data-light="${i}"]`));
  const fileText = svg.querySelector("[data-file]");
  const countText = svg.querySelector("[data-count]");
  const monitor = svg.querySelector("[data-monitor]");
  const length = route.getTotalLength();

  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const UP = 1.1;
  const AT = 0.5;
  const DOWN = 1.1;
  const TRIP = UP + AT + DOWN;
  const READ = 1.6; // pause after the HTML arrives, while the browser reads it
  const HOLD = 3.2;
  // Start time of each trip
  const STARTS = [0, TRIP + READ, 2 * TRIP + READ, 3 * TRIP + READ];
  const END = 4 * TRIP + READ;

  let t = 0;
  let playing = false;

  const say = (text) => {
    if (readout && readout.textContent !== text) readout.textContent = text;
  };

  function place(u) {
    const p = route.getPointAtLength(u * length);
    capsule.setAttribute("cx", p.x.toFixed(2));
    capsule.setAttribute("cy", p.y.toFixed(2));
  }

  function render() {
    lights.forEach((el) => el.toggleAttribute("data-on", false));
    capsule.style.opacity = "0";
    capsule.toggleAttribute("data-full", false);
    let done = 0;
    let text = "One page, 4 requests";
    for (let i = 0; i < 4; i++) {
      const s = t - STARTS[i];
      if (s < 0) break;
      if (s >= TRIP - 1e-6) {
        done = i + 1;
        continue;
      }
      fileText.textContent = FILES[i];
      countText.textContent = `request ${i + 1} of 4`;
      text = `Request ${i + 1} of 4 · ${FILES[i]}`;
      capsule.style.opacity = "1";
      if (s < UP) place(ease(1 - s / UP));
      else if (s < UP + AT) {
        place(0);
        capsule.style.opacity = "0";
        lights[i].toggleAttribute("data-on", true);
      } else {
        capsule.toggleAttribute("data-full", true);
        place(ease((s - UP - AT) / DOWN));
      }
    }
    layers.forEach((el, i) => (el.style.opacity = i < done ? "1" : "0"));
    if (done === 1 && t < STARTS[1]) text = "The HTML names 3 more files, so the browser asks for each";
    if (done === 4) {
      fileText.textContent = "page loaded";
      countText.textContent = "4 of 4";
    }
    if (t === 0) {
      fileText.textContent = "ready";
      countText.textContent = "0 of 4";
    }
    say(text);
  }

  let raf = 0;
  let previous = 0;
  let visible = false;
  let wasDone = false;
  function tick(now) {
    const dt = previous ? Math.min((now - previous) / 1000, 1 / 30) : 1 / 60;
    previous = now;
    if (playing) {
      t += dt;
      if (t >= END && !wasDone) {
        wasDone = true;
        if (status) status.textContent = "The page is loaded. It took 4 requests.";
      }
      if (t >= END + HOLD) {
        t = 0;
        wasDone = false;
      }
    }
    render();
    raf = visible && playing ? requestAnimationFrame(tick) : 0;
  }
  function run() {
    if (!raf && visible && playing) {
      previous = 0;
      raf = requestAnimationFrame(tick);
    }
  }

  function restart() {
    t = still.matches ? END : 0;
    wasDone = false;
    playing = !still.matches;
    if (status) status.textContent = "Loading the page again.";
    render();
    run();
  }

  monitor.addEventListener("click", restart);
  reload?.addEventListener("click", restart);
  const observer = new IntersectionObserver(
    (entries) => {
      visible = entries[entries.length - 1].isIntersecting;
      run();
    },
    { rootMargin: "80px 0px" },
  );
  observer.observe(svg);

  // Rest state: the finished page, so the figure reads without motion. The tour starts on view.
  t = END;
  render();
  if (!still.matches) {
    t = 0;
    playing = true;
  }
  root.dataset.ready = "true";

  return () => {
    delete root.dataset.ready;
    cancelAnimationFrame(raf);
    observer.disconnect();
    monitor.removeEventListener("click", restart);
    reload?.removeEventListener("click", restart);
  };
}
