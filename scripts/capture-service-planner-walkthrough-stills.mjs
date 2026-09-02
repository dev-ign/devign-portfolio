import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.env.DEVIGN_URL ?? 'http://127.0.0.1:3000';
const outputDir = path.resolve('artifacts/service-planner-floating-cards/walkthrough/stills');
await fs.mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 810 },
  reducedMotion: 'reduce',
});
const page = await context.newPage();
await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 });
await page.evaluate(() => document.fonts?.ready);
await page.waitForTimeout(800);

const services = page.locator('#services');
await services.waitFor({ state: 'attached' });
const servicesY = await services.evaluate(
  element => element.getBoundingClientRect().top + window.scrollY - 96,
);
await page.evaluate(y => window.scrollTo({ top: y, behavior: 'auto' }), servicesY);
await page.waitForTimeout(500);

const sectionTop = await services.evaluate(element => element.getBoundingClientRect().top);
if (sectionTop < 0 || sectionTop > 220) {
  throw new Error(`Could not position the services section for capture (top: ${sectionTop}).`);
}

const capture = async (filename) => {
  await page.screenshot({ path: path.join(outputDir, filename), type: 'png' });
};

const websites = page.getByRole('button', { name: 'Explore Websites: Build Your Presence' });
const applications = page.getByRole('button', { name: 'Explore Applications: Build Your Product' });
const branding = page.getByRole('button', { name: 'Explore Branding: Build Your Brand' });
const motion = page.getByRole('button', { name: 'Explore Motion: Tell Your Story' });

await capture('01-floating-card-gallery.png');
await websites.hover();
await page.waitForTimeout(450);
await capture('02-websites-active.png');
await applications.hover();
await page.waitForTimeout(450);
await capture('03-applications-active.png');
await branding.hover();
await page.waitForTimeout(450);
await capture('04-branding-active.png');
await motion.hover();
await page.waitForTimeout(450);
await capture('05-motion-active.png');

await websites.click();
await page.getByRole('dialog', { name: 'Websites' }).waitFor({ state: 'visible' });
await page.waitForTimeout(450);
await capture('06-planner-launch.png');
await page.getByRole('radio', { name: /Business website/ }).click();
await page.waitForTimeout(350);
await capture('07-recommendation-updates.png');
await page.getByRole('button', { name: 'Continue →' }).click();
await page.waitForTimeout(350);
await capture('08-questionnaire-progress.png');

await context.close();
await browser.close();
console.log(`Captured 8 walkthrough stills in ${outputDir}.`);
