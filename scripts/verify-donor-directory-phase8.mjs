import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.env.DONOR_DIRECTORY_URL
  ?? 'http://127.0.0.1:3000/case-studies/donor-directory';
const qaPath = path.resolve('artifacts/phase8/qa/browser-qa.json');
const screenshotDir = path.resolve('artifacts/phase8/screenshots');
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'no-preference',
});

const directHashOffsets = {};
for (const id of [
  'opportunity',
  'design-principles',
  'experience',
  'donor-context',
  'building-reusable-components',
  'designing-for-engineering',
  'accessibility-and-polish',
  'impact',
]) {
  const page = await context.newPage();
  await page.goto(`${baseUrl}#${id}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() =>
    document.querySelector('[data-case-study-motion-root]')?.hasAttribute('data-motion-breakpoint')
  );
  await page.waitForTimeout(2400);
  directHashOffsets[id] = await page.locator(`#${id}`).evaluate((element) =>
    Math.round(element.getBoundingClientRect().top)
  );
  if (id === 'donor-context') {
    await page.screenshot({ path: path.join(screenshotDir, 'normal-drawer-1440x900.png') });
  }
  if (id === 'building-reusable-components') {
    await page.screenshot({ path: path.join(screenshotDir, 'normal-systems-1440x900.png') });
  }
  if (id === 'impact') {
    await page.screenshot({ path: path.join(screenshotDir, 'normal-impact-1440x900.png') });
  }
  await page.close();
}

const replayPage = await context.newPage();
await replayPage.goto(`${baseUrl}#donor-context`, { waitUntil: 'networkidle' });
await replayPage.waitForTimeout(2400);
const animatedDemo = replayPage.locator('[data-testid="live-directory-demo-hero"]');
await animatedDemo.scrollIntoViewIfNeeded();
await animatedDemo.getByRole('button', { name: 'Replay row-to-drawer animation' }).click();
await replayPage.waitForTimeout(120);
const replayStage = await animatedDemo.locator('.donor-directory-playback > span').innerText();
await replayPage.close();

const qa = JSON.parse(await fs.readFile(qaPath, 'utf8'));
qa.directHashOffsets = directHashOffsets;
qa.interactionChecks.replayReturnsToResting =
  replayStage.trim().toLowerCase() === 'resting directory';
qa.interactionChecks.replayStage = replayStage;
await fs.writeFile(qaPath, `${JSON.stringify(qa, null, 2)}\n`);

await context.close();
await browser.close();
console.log(JSON.stringify({ directHashOffsets, replayStage }, null, 2));
