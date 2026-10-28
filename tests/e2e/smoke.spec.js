import { test, expect } from "@playwright/test";

test("home page shows the store name", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "MR SHOP" })).toBeVisible();
});
