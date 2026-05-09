import { test, expect } from '@playwright/test';

test('verify light theme desktop', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.evaluate(() => localStorage.setItem('ethnafrika_theme', 'light'));
  await page.reload();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'verification/desktop_light.png' });
});

test('verify light theme mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('http://localhost:3000');
  await page.evaluate(() => localStorage.setItem('ethnafrika_theme', 'light'));
  await page.reload();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'verification/mobile_light.png' });
});
