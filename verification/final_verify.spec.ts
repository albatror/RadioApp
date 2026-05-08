import { test, expect } from '@playwright/test';

test('Verify PC version has no search bar and no footer', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:3001');
  await page.waitForTimeout(2000);

  // Check TopBar for search
  const search = page.locator('.search');
  await expect(search).not.toBeVisible();

  // Check for mobile footer
  const footer = page.locator('.footer-strip');
  await expect(footer).not.toBeVisible();
});

test('Verify Mobile version has footer and QR code', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('http://localhost:3001');
  await page.waitForTimeout(2000);

  // Check for mobile footer
  const footer = page.locator('.footer-strip');
  await expect(footer).toBeVisible();

  // Check for QR in footer
  const qr = footer.locator('.qr-box svg');
  await expect(qr).toBeVisible();

  await page.screenshot({ path: 'verification/mobile_final.png', fullPage: true });
});
