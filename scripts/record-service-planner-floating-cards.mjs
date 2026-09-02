import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.env.DEVIGN_URL ?? 'http://127.0.0.1:3000';
const outputDir = path.resolve('artifacts/service-planner-floating-cards/walkthrough');
const rawDir = path.join(outputDir, 'raw');
await fs.mkdir(rawDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 810 },
  recordVideo: { dir: rawDir, size: { width: 1440, height: 810 } },
});
const page = await context.newPage();
const pageErrors = [];
page.on('pageerror', error => pageErrors.push(error.message));

await page.goto(baseUrl, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts?.ready);
await page.waitForTimeout(900);

const compileOverlayVisible = await page.evaluate(() =>
  document.body.innerText.includes('Compiled with problems:')
    || document.querySelector('iframe#webpack-dev-server-client-overlay') !== null
);
if (compileOverlayVisible) {
  throw new Error('Recording aborted because the development compile overlay is visible.');
}

await page.locator('#services').scrollIntoViewIfNeeded();
await page.evaluate(() => window.scrollBy(0, -90));
await page.waitForTimeout(1600);

const websites = page.getByRole('button', { name: 'Explore Websites: Build Your Presence' });
const applications = page.getByRole('button', { name: 'Explore Applications: Build Your Product' });
const branding = page.getByRole('button', { name: 'Explore Branding: Build Your Brand' });
const motion = page.getByRole('button', { name: 'Explore Motion: Tell Your Story' });

await websites.hover();
await page.waitForTimeout(1100);
await applications.hover();
await page.waitForTimeout(850);
await branding.hover();
await page.waitForTimeout(850);
await motion.hover();
await page.waitForTimeout(850);
await websites.hover();
await page.waitForTimeout(700);

await websites.click();
await page.getByRole('dialog', { name: 'Websites' }).waitFor({ state: 'visible' });
await page.waitForTimeout(1500);
await page.getByRole('radio', { name: /Business website/ }).click();
await page.waitForTimeout(1000);
await page.getByRole('button', { name: 'Continue →' }).click();
await page.waitForTimeout(1300);
await page.keyboard.press('Escape');
await page.waitForTimeout(1300);

if (pageErrors.length) throw new Error(`Page errors during recording: ${pageErrors.join('; ')}`);

const video = page.video();
await context.close();
await video?.saveAs(path.join(outputDir, 'devignux-floating-branch-cards-walkthrough.webm'));
await browser.close();

console.log('Recorded DevignUX floating branch cards walkthrough.');
