import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.env.DONOR_DIRECTORY_URL
  ?? 'http://localhost:3000/case-studies/donor-directory';
const outputDir = path.resolve('artifacts/phase8b/walkthrough');
const rawDir = path.join(outputDir, 'raw');
await fs.mkdir(rawDir, { recursive: true });

const browser = await chromium.launch({ headless: true });

const createRecording = async ({ filename, reducedMotion, run }) => {
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
  const compileOverlayVisible = await page.evaluate(() =>
    document.body.innerText.includes('Compiled with problems:')
      || document.querySelector('iframe#webpack-dev-server-client-overlay') !== null
  );
  if (compileOverlayVisible) {
    throw new Error('Recording aborted because the development compile overlay is visible.');
  }
  await run(page);
  const video = page.video();
  await page.close();
  await context.close();
  await video?.saveAs(path.join(outputDir, filename));
};

const naturalScroll = (interval) => async (page) => {
  const maximumScroll = await page.evaluate(() =>
    Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
  );
  const distance = 520;
  const steps = Math.ceil(maximumScroll / distance);
  for (let step = 0; step < steps; step += 1) {
    await page.mouse.wheel(0, distance);
    await page.waitForTimeout(interval);
  }
  await page.waitForTimeout(600);
};

const comparisonScroll = async (page) => {
  const maximumScroll = await page.evaluate(() =>
    Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
  );
  const steps = 184;
  for (let step = 0; step <= steps; step += 1) {
    const target = Math.round((maximumScroll * step) / steps);
    await page.evaluate((scrollTop) => window.scrollTo(0, scrollTop), target);
    await page.waitForTimeout(270);
  }
  await page.waitForTimeout(400);
};

await createRecording({
  filename: 'donor-directory-normal-natural.webm',
  reducedMotion: 'no-preference',
  run: naturalScroll(520),
});
await createRecording({
  filename: 'donor-directory-reduced-natural.webm',
  reducedMotion: 'reduce',
  run: naturalScroll(230),
});
await createRecording({
  filename: 'donor-directory-comparison-source.webm',
  reducedMotion: 'no-preference',
  run: comparisonScroll,
});

await browser.close();
console.log('Recorded Phase 8B natural and comparison walkthroughs.');
