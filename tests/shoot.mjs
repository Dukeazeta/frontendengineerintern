// Full-page review captures: node tests/shoot.mjs [url] [outdir]
import { chromium } from "@playwright/test";
const url = process.argv[2] ?? "http://localhost:3000";
const out = process.argv[3] ?? ".impeccable/review";
const browser = await chromium.launch({ channel: "chrome" });
for (const [name, width, height] of [["desktop", 1440, 900], ["mobile", 390, 844]]) {
  const page = await browser.newPage({ viewport: { width, height }, reducedMotion: "reduce" });
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${out}/${name}-fold.png` });
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: true });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(name, "overflow", overflow, "errors", errors.length ? errors : "none");
  await page.close();
}
await browser.close();
