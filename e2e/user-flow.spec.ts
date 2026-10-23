import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    class FakeUtterance {
      lang = '';
      rate = 1;
      pitch = 1;
      volume = 1;
      voice = null;
      onend: (() => void) | null = null;
      onerror: (() => void) | null = null;

      constructor(readonly text: string) {}
    }

    Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: FakeUtterance });
    Object.defineProperty(window, 'speechSynthesis', {
      value: {
        cancel: () => undefined,
        getVoices: () => [],
        speak: (utterance: FakeUtterance) => window.setTimeout(() => utterance.onend?.(), 50),
      },
    });
  });
});

test('merchant simulates a payment and sees it announced', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Dengar pembayaran');

  const amount = page.getByLabel('Nominal pembayaran');
  await amount.fill('61500');
  await page.getByRole('button', { name: 'Simulasikan pembayaran' }).click();

  await expect(page.getByText('Pembayaran Rp61.500 berhasil diumumkan.')).toBeVisible();
  await expect(page.getByText('Rp61.500', { exact: true })).toBeVisible();
  await expect(page.locator('.transaction').first().getByText('announced')).toBeVisible();
});

test('device volume remains usable on the current viewport', async ({ page }) => {
  await page.goto('/');
  const volume = page.getByLabel('Volume pengumuman');
  await volume.fill('64');
  await expect(page.locator('.hero-device strong')).toHaveText('64%');
});
