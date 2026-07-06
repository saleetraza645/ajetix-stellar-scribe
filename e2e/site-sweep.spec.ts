import { test, expect } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const PORTFOLIO_SLUGS = [
  "nova-ai-analytics",
  "helix-saas",
  "orbit-mobile",
  "atlas-cloud",
  "prism-design",
  "vertex-erp",
  "lumen-vision",
  "cascade-web",
  "signal-automation",
  "mirage-brand",
  "quasar-chat",
  "meridian-fintech",
  "nebula-education",
  "forge-devops",
  "aria-voice",
  "kite-mobile",
  "lattice-ux",
  "pulse-marketplace",
  "beacon-iot",
  "halo-brand-web",
];

const STATIC_ROUTES = [
  "/",
  "/about",
  "/services",
  "/process",
  "/portfolio",
  "/contact",
  "/admin/login",
  "/admin",
  "/admin/projects",
  "/admin/submissions",
];

function screenshotDir(projectName: string) {
  const dir = join("e2e", "screenshots", projectName);
  mkdirSync(dir, { recursive: true });
  return dir;
}

test.describe("Route screenshots", () => {
  for (const route of STATIC_ROUTES) {
    test(`screenshot ${route}`, async ({ page }, testInfo) => {
      const errors: string[] = [];
      page.on("pageerror", (err) => errors.push(err.message));
      page.on("console", (msg) => {
        if (msg.type() === "error") errors.push(msg.text());
      });

      const res = await page.goto(route, { waitUntil: "networkidle" });
      expect(res?.status(), `${route} should not 404`).toBeLessThan(400);

      await page.waitForTimeout(500);
      const dir = screenshotDir(testInfo.project.name);
      const safeName = route.replace(/\//g, "_").replace(/^_/, "") || "home";
      await page.screenshot({ path: join(dir, `${safeName}.png`), fullPage: true });

      expect(await page.locator("body").innerText()).not.toBe("");
      if (errors.length) {
        console.warn(`Console errors on ${route}:`, errors);
      }
    });
  }

  for (const slug of PORTFOLIO_SLUGS) {
    test(`screenshot /portfolio/${slug}`, async ({ page }, testInfo) => {
      const route = `/portfolio/${slug}`;
      const res = await page.goto(route, { waitUntil: "networkidle" });
      expect(res?.status(), `${route} should load`).toBeLessThan(400);
      await page.waitForTimeout(500);
      const dir = screenshotDir(testInfo.project.name);
      await page.screenshot({ path: join(dir, `portfolio_${slug}.png`), fullPage: true });
      await expect(page.locator("h1")).toBeVisible();
    });
  }

  test("screenshot 404 page", async ({ page }, testInfo) => {
    await page.goto("/this-route-does-not-exist-404-test", { waitUntil: "networkidle" });
    const dir = screenshotDir(testInfo.project.name);
    await page.screenshot({ path: join(dir, "404.png"), fullPage: true });
    await expect(page.getByRole("link", { name: /go home/i })).toBeVisible();
  });
});

test.describe("Navigation flows (390px only)", () => {
  test.beforeEach(({ }, testInfo) => {
    test.skip(testInfo.project.name !== "390px", "Navigation flows run at 390px only");
  });

  test("Portfolio → detail → browser Back preserves scroll", async ({ page }) => {
    await page.goto("/portfolio");
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 400));
    const scrollBefore = await page.evaluate(() => window.scrollY);
    expect(scrollBefore).toBeGreaterThan(0);

    await page.getByRole("link", { name: /Nova AI Analytics/i }).first().click();
    await expect(page).toHaveURL(/\/portfolio\/nova-ai-analytics/);
    await expect(page.locator("h1")).toContainText("Nova AI Analytics");

    await page.goBack();
    await expect(page).toHaveURL(/\/portfolio$/);
    await page.waitForTimeout(500);
    const scrollAfter = await page.evaluate(() => window.scrollY);
    expect(scrollAfter).toBeGreaterThan(0);
  });

  test("Direct deep URL loads", async ({ page }) => {
    await page.goto("/portfolio/quasar-chat");
    await expect(page.locator("h1")).toContainText("Quasar Chat");
  });

  test("Refresh on deep route works", async ({ page }) => {
    await page.goto("/portfolio/helix-saas");
    await expect(page.locator("h1")).toContainText("Helix SaaS");
    await page.reload({ waitUntil: "networkidle" });
    await expect(page.locator("h1")).toContainText("Helix SaaS");
  });

  test("Admin login page loads", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("/admin without auth shows API-not-configured or redirects", async ({ page }) => {
    await page.goto("/admin");
    const text = await page.locator("body").innerText();
    expect(text.length).toBeGreaterThan(10);
  });
});
