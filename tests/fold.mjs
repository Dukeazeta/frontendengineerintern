// Where the hero screen's bottom edge lands at 1440x900.
import { chromium } from "@playwright/test";
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
await page.goto(process.argv[2] ?? "http://localhost:3000", { waitUntil: "networkidle" });
const box = await page.evaluate(() => { const r = document.querySelector(".fe-glass").getBoundingClientRect(); return { top: Math.round(r.top), bottom: Math.round(r.bottom) }; });
console.log("screen glass", box);
await browser.close();
