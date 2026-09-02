import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.env.DEVIGN_URL ?? 'http://127.0.0.1:3000';
const outputDir = path.resolve('artifacts/services-navigation-refinement');
const rawDir = await fs.mkdtemp(path.join(os.tmpdir(), 'devign-services-walkthrough-'));
await fs.mkdir(outputDir, { recursive: true });

const chapters = [
  { id: 'websites', label: 'Websites' },
  { id: 'web-applications', label: 'Web Applications' },
  { id: 'branding-marketing', label: 'Branding & Marketing' },
  { id: 'motion-video', label: 'Motion & Video' },
];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: rawDir, size: { width: 1440, height: 900 } },
});
const page = await context.newPage();
const pageErrors = [];
page.on('pageerror', error => pageErrors.push(error.message));

await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 });
await page.locator('#service-websites').waitFor();
await page.evaluate(() => document.fonts?.ready);
await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
await page.waitForTimeout(900);

const websitesY = await page.locator('#service-websites').evaluate(
  element => element.getBoundingClientRect().top + window.scrollY,
);
await page.evaluate(targetY => window.scrollTo(0, targetY + 1), websitesY);
await page.waitForFunction(() =>
  document.querySelector('.service-chapter-sequence')?.getAttribute('data-active-service') === 'websites'
);
await page.getByRole('button', { name: /open navigation menu for services/i }).waitFor();
await page.waitForTimeout(1_600);
await page.getByRole('button', { name: 'Websites', exact: true }).click();
await page.waitForFunction(() =>
  document.querySelector('.service-chapter-sequence')?.getAttribute('data-active-service') === 'websites'
);
await page.waitForFunction(() =>
  document.querySelector('.service-chapter-sequence')?.getAttribute('data-transitioning') === 'false'
);
await page.waitForTimeout(700);

const states = [];

const recordState = async chapter => {
  const metrics = await page.locator('[data-navigation-mode="contextual"]').evaluate(nav => {
    const buttons = Array.from(nav.querySelectorAll('[data-service-id]'))
      .filter(element => element.getBoundingClientRect().width > 0);
    const layer = buttons[0]?.parentElement?.getBoundingClientRect();
    const first = buttons[0]?.getBoundingClientRect();
    const last = buttons.at(-1)?.getBoundingClientRect();
    const activeButton = nav.querySelector('[data-service-id][aria-current="location"]');
    const active = activeButton?.getBoundingClientRect();
    if (!layer || !first || !last || !active) return null;
    return {
      layerWidth: Math.round(layer.width),
      leftClearance: Math.round(first.left - layer.left),
      rightClearance: Math.round(layer.right - last.right),
      activeClearanceLeft: Math.round(active.left - layer.left),
      activeClearanceRight: Math.round(layer.right - active.right),
      activeId: activeButton?.getAttribute('data-service-id'),
    };
  });
  if (metrics?.activeId !== chapter.id) {
    throw new Error(`Expected ${chapter.id} to be active, received ${metrics?.activeId ?? 'none'}.`);
  }
  states.push({ ...chapter, metrics });
};

await recordState(chapters[0]);
await page.mouse.wheel(0, 80);
await page.waitForTimeout(900);

for (const chapter of chapters.slice(1)) {
  await page.getByRole('button', { name: chapter.label, exact: true }).click();
  await page.waitForFunction(
    serviceId => document.querySelector('.service-chapter-sequence')?.getAttribute('data-active-service') === serviceId,
    chapter.id,
  );
  await page.waitForFunction(() =>
    document.querySelector('.service-chapter-sequence')?.getAttribute('data-transitioning') === 'false'
  );
  await page.waitForTimeout(1_550);
  await recordState(chapter);
}

await page.mouse.wheel(0, -80);
await page.waitForTimeout(900);
await page.getByRole('button', { name: 'Branding & Marketing', exact: true }).click();
await page.waitForFunction(() =>
  document.querySelector('.service-chapter-sequence')?.getAttribute('data-active-service') === 'branding-marketing'
);
await page.waitForTimeout(1_100);

await page.getByRole('button', { name: 'Motion & Video', exact: true }).click();
await page.waitForFunction(() =>
  document.querySelector('.service-chapter-sequence')?.getAttribute('data-active-service') === 'motion-video'
);
await page.waitForFunction(() =>
  document.querySelector('.service-chapter-sequence')?.getAttribute('data-transitioning') === 'false'
);
await page.waitForTimeout(1_650);

if (pageErrors.length) {
  throw new Error(`Walkthrough page errors: ${pageErrors.join('; ')}`);
}

const video = page.video();
await context.close();
await video?.saveAs(path.join(outputDir, 'services-refinement-walkthrough-1440x900.webm'));
await browser.close();

await fs.writeFile(
  path.join(outputDir, 'walkthrough-qa.json'),
  `${JSON.stringify({ viewport: { width: 1440, height: 900 }, states, pageErrors }, null, 2)}\n`,
  'utf8',
);

console.log(`Recorded Services refinement walkthrough and verified ${states.length} active states.`);
