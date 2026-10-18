import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/who-we-are",
  "/what-we-do",
  "/departments",
  "/apply-for-training",
  "/for-organisations",
  "/partner-with-us",
  "/our-impact",
  "/news-and-updates",
] as const;

for (const route of routes) {
  test(`${route} renders an accessible editorial composition`, async ({ page }, testInfo) => {
    const runtimeErrors: string[] = [];
    page.on("pageerror", (error) => runtimeErrors.push(error.message));

    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("[data-component-type]").first()).toBeVisible();

    const sectionCount = await page.locator("[data-component-type]").count();
    expect(sectionCount).toBeGreaterThanOrEqual(route === "/news-and-updates" ? 5 : 6);

    const invalidLinks = await page.locator('a[href="#"], a:not([href])').count();
    expect(invalidLinks).toBe(0);

    const missingImageAlt = await page.locator("main img:not([alt]), main img[alt='']").count();
    expect(missingImageAlt).toBe(0);

    const duplicateIds = await page.evaluate(() => {
      const ids = [...document.querySelectorAll<HTMLElement>("[id]")].map((node) => node.id);
      return ids.filter((id, index) => ids.indexOf(id) !== index);
    });
    expect(duplicateIds).toEqual([]);

    const hasPageOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(hasPageOverflow).toBe(false);
    expect(runtimeErrors).toEqual([]);

    if (route === "/" && testInfo.project.name === "chromium-desktop") {
      const heroPanel = await page.locator('[data-section-id="home-hero"] > div').boundingBox();
      const viewport = page.viewportSize();
      expect(heroPanel, "homepage hero panel is missing").not.toBeNull();
      expect(viewport, "desktop viewport is missing").not.toBeNull();
      expect(heroPanel!.y + heroPanel!.height).toBeLessThanOrEqual(viewport!.height);
    }

    if (testInfo.project.name === "chromium-mobile") {
      const menuButton = page.getByRole("button", { name: "Open menu" });
      await expect(menuButton).toBeVisible();
      await expect(menuButton).toHaveAttribute("aria-expanded", "false");
      await menuButton.click();
      await expect(menuButton).toHaveAttribute("aria-expanded", "true");
      await expect(page.locator("#mobile-navigation")).toBeVisible();
    } else {
      await page.keyboard.press("Tab");
      await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
    }
  });
}
