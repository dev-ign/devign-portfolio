import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.env.DONOR_DIRECTORY_URL
  ?? 'http://127.0.0.1:3000/case-studies/donor-directory';
const outputDir = path.resolve('artifacts/phase8/walkthrough/final');
const rawDir = path.join(outputDir, 'raw');
await fs.mkdir(rawDir, { recursive: true });

const browser = await chromium.launch({ headless: true });

const recordWalkthrough = async ({
  filename,
  reducedMotion,
  steps,
  interval,
}) => {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion,
    recordVideo: { dir: rawDir, size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.waitForFunction(() =>
    document.querySelector('[data-case-study-motion-root]')?.hasAttribute('data-motion-breakpoint')
  );
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(reducedMotion === 'reduce' ? 300 : 900);

  const maximumScroll = await page.evaluate(() =>
    Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
  );
  for (let step = 0; step <= steps; step += 1) {
    const target = Math.round((maximumScroll * step) / steps);
    await page.evaluate((scrollTop) => window.scrollTo(0, scrollTop), target);
    await page.waitForTimeout(interval);
  }
  await page.waitForTimeout(400);

  const video = page.video();
  await page.close();
  await context.close();
  await video?.saveAs(path.join(outputDir, filename));
};

await recordWalkthrough({
  filename: 'donor-directory-normal-walkthrough.webm',
  reducedMotion: 'no-preference',
  steps: 184,
  interval: 270,
});
await recordWalkthrough({
  filename: 'donor-directory-reduced-walkthrough.webm',
  reducedMotion: 'reduce',
  steps: 52,
  interval: 170,
});

await browser.close();
console.log('Recorded isolated normal and reduced-motion walkthroughs.');
