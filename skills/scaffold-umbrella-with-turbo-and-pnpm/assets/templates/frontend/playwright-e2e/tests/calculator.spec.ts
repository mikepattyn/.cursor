import { expect, test } from '@playwright/test';

test('compute', async ({ page }) => {
  await page.goto('/');
  await page.locator('input[name="left"]').fill('6');
  await page.locator('input[name="right"]').fill('3');
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page.getByText('Result: 9')).toBeVisible();
});

test('persist reload', async ({ page }) => {
  await page.goto('/');
  await page.locator('input[name="left"]').fill('4');
  await page.locator('input[name="right"]').fill('2');
  await page.getByRole('button', { name: 'Multiply' }).click();
  await expect(page.getByText('Result: 8')).toBeVisible();
  await expect(page.getByRole('status')).toContainText(/Saved|offline/i);
  await page.reload();
  await expect(page.getByText('Result: 8')).toBeVisible();
});

test('degraded persist', async ({ page }) => {
  await page.route('**/api/calculator/value', async (route) => {
    if (route.request().method() === 'PUT') {
      await route.abort('failed');
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ value: null, updatedAt: null }),
    });
  });
  await page.goto('/');
  await page.locator('input[name="left"]').fill('10');
  await page.locator('input[name="right"]').fill('2');
  await page.getByRole('button', { name: 'Subtract' }).click();
  await expect(page.getByText('Result: 8')).toBeVisible();
  await expect(page.getByRole('status')).toContainText(/offline/i);
});
