import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const output = resolve('../Porto/Rispeak/screenshots');
await Promise.all([
  mkdir(resolve(output, 'overview'), { recursive: true }),
  mkdir(resolve(output, 'core-features'), { recursive: true }),
  mkdir(resolve(output, 'responsive'), { recursive: true }),
]);

const browser = await chromium.launch();
const desktop = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
await desktop.goto('http://127.0.0.1:4580');
await desktop.screenshot({ path: resolve(output, 'overview/dashboard.png'), fullPage: true });
await desktop.getByLabel('Nominal pembayaran').fill('61500');
await desktop.getByRole('button', { name: 'Simulasikan pembayaran' }).click();
await desktop.waitForTimeout(1_100);
await desktop.screenshot({
  path: resolve(output, 'core-features/payment-announced.png'),
  fullPage: true,
});

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto('http://127.0.0.1:4580');
await mobile.screenshot({
  path: resolve(output, 'responsive/mobile-dashboard.png'),
  fullPage: true,
});
await browser.close();
