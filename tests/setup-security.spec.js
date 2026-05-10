import { test, expect } from '@playwright/test';

test('Setup page visibility and locking', async ({ page }) => {
  // 1. Check if setup is accessible with the correct key
  await page.goto('http://localhost:3000/#setup?key=chai123');
  await expect(page.locator('text=Setup Wizard')).toBeVisible();

  // 2. Check if setup is hidden with wrong key
  await page.goto('http://localhost:3000/#setup?key=wrong');
  await expect(page.locator('text=Setup Wizard')).not.toBeVisible();
  await expect(page.locator('text=Support Arjun')).toBeVisible(); // Should fall back to SupporterPage

  // 3. Check if setup is hidden with no key
  await page.goto('http://localhost:3000/#setup');
  await expect(page.locator('text=Setup Wizard')).not.toBeVisible();
});
