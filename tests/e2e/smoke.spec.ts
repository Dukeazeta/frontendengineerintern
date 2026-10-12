import { expect, test } from "@playwright/test";

test("home renders without horizontal scroll", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("From zero to frontend engineer.");
  await expect(page.locator("#chapter-01")).toBeVisible();
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

test("Lesson 1 opens from the roadmap and the quiz completes", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("link", { name: "Start reading" }).click();
  await expect(page).toHaveURL(/\/learn\/chapter-01\/client-and-server$/, { timeout: 30000 });
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Client and server");
  await expect(page.locator(".fe-figure[data-ready]:visible")).toHaveCount(2);
  const readout = page.locator('[id="fig-1.1"] [data-readout]');
  await expect(readout).toHaveText("3 clients, 1 server");
  await page.getByRole("button", { name: "Phone asks" }).click();
  await expect(readout).toHaveText("1 page served");
  await page.getByRole("button", { name: "missing.html" }).click();
  await expect(page.locator('[id="fig-1.2"] [data-readout]')).toHaveText("missing.html · 404 Not Found");
  const answers = ["Your phone’s browser", "Sends a copy of the files", "An error that says not found", "So they can answer anytime", "Yes, if it runs server software"];
  await page.getByRole("button", { name: "The newspaper’s server" }).click();
  await expect(page.getByText("The client is the one that asks for the page.")).toBeVisible();
  for (const answer of answers) await page.getByRole("button", { name: answer }).click();
  await expect(page.getByText("All five right. Section 1.1 is done.")).toBeVisible();
});
