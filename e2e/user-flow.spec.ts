import { expect, test } from '@playwright/test';

test('merchant simulates a payment and sees it announced', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Dengar pembayaran');

  const amount = page.getByLabel('Nominal pembayaran');
  await amount.fill('61500');
  await page.getByRole('button', { name: 'Simulasikan pembayaran' }).click();

  await expect(page.getByText('Pembayaran Rp61.500 masuk ke antrean suara.')).toBeVisible();
  await expect(page.getByText('Rp61.500', { exact: true })).toBeVisible();
  await expect(page.locator('.transaction').first().getByText('announced')).toBeVisible();
});

test('device volume remains usable on the current viewport', async ({ page }) => {
  await page.goto('/');
  const volume = page.getByLabel('Volume pengumuman');
  await volume.fill('64');
  await expect(page.locator('.hero-device strong')).toHaveText('64%');
});
