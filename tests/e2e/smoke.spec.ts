import { expect, test } from "@playwright/test";

test("home renders without horizontal scroll", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("From zero to frontend engineer.");
  await expect(page.locator("#level-01")).toBeVisible();
  await expect(page.getByText("Coming soon").first()).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
});

test("Fig 0 switches change the page and the readout", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const readout = page.locator("[data-readout]");
  await expect(readout).toHaveText("3 of 3 layers on · 1 click");
  await page.locator(".fe-hero").focus();
  await page.keyboard.press("2");
  await expect(readout).toHaveText("2 of 3 layers on · 1 click");
  await expect(page.getByRole("button", { name: "CSS" })).toHaveAttribute("aria-pressed", "false");
  await page.keyboard.press("1");
  await expect(readout).toHaveText("Needs HTML first");
});
