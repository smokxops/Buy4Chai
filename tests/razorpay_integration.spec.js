import { test, expect } from '@playwright/test';

test('Razorpay gateway integration flow', async ({ page }) => {
  // 1. Go to Setup Wizard
  await page.goto('http://localhost:3000/#setup?key=chai123');

  // 2. Fill Identity
  await page.locator('section').filter({ hasText: '1. Identity' }).getByPlaceholder('Arjun Sharma').fill('Test User');
  await page.getByPlaceholder('I build open source tools and write about web dev. Every chai helps!').fill('Test Bio');

  // 3. Scroll to Gateway section and select Razorpay
  await page.getByText('4. Gateway').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Razorpay Best for India' }).click();

  // 4. Enter Razorpay Key ID
  await page.locator('section').filter({ hasText: '4. Gateway' }).getByPlaceholder('rzp_live_...').fill('rzp_test_XXXXXXXXXXXX');

  // 5. Click "Done! View My Page"
  // Note: Done! View My Page button in SetupPage just sets window.location.href = '/'
  // but it doesn't save the config to disk. In a real scenario, the user would copy the config.
  // For the purpose of this test, we are testing the UI flow.
  await page.getByRole('button', { name: 'Done! View My Page' }).click();

  // 6. Verify we are on the supporter page
  await expect(page).toHaveURL('http://localhost:3000/');
  // Since we didn't actually save the config to disk, it will still show "Arjun" from the default config.
  // So we check for the default name instead of the one we just typed in the wizard.
  await expect(page.getByText('Hey, I\'m Arjun!')).toBeVisible();

  // 7. Click "Buy me a chai" to open payment modal
  await page.getByRole('button', { name: 'Buy me a chai' }).click();
  await expect(page.getByText('Support my work')).toBeVisible();

  // 8. Select a preset and verify "Support with Razorpay" button
  await page.getByRole('button', { name: '$2', exact: true }).or(page.getByRole('button', { name: '$2 ₹' })).first().click();
  const payButton = page.getByRole('button', { name: /Support with Razorpay/ });
  await expect(payButton).toBeVisible();

  // 9. Click Pay (This will attempt to load the SDK and open it)
  // Since we don't want to actually interact with the Razorpay iframe in a headless environment easily,
  // we just verify that clicking it doesn't immediately fail and attempts to process.
  // In a real scenario, the Razorpay SDK would inject an iframe.

  await payButton.click();

  // 10. Verify sandbox bypass for UX testing
  // Since we used 'rzp_test_XXXXXXXXXXXX', the payment should resolve successfully (mocked).
  await expect(page.getByText('Thank You!')).toBeVisible({ timeout: 5000 });
});
