import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.env.DONOR_DIRECTORY_URL
  ?? 'http://127.0.0.1:3000/case-studies/donor-directory';
const artifactRoot = path.resolve('artifacts/phase8');
const screenshotDir = path.join(artifactRoot, 'screenshots');
const walkthroughDir = path.join(artifactRoot, 'walkthrough');
const rawVideoDir = path.join(walkthroughDir, 'raw');
const qaDir = path.join(artifactRoot, 'qa');

await Promise.all(
  [screenshotDir, walkthroughDir, rawVideoDir, qaDir].map((directory) =>
    fs.mkdir(directory, { recursive: true })
  )
);

const browser = await chromium.launch({ headless: true });
const browserErrors = [];

const waitForMotion = async (page) => {
  await page.waitForLoadState('networkidle');
  await page.waitForFunction(() =>
    document.querySelector('[data-case-study-motion-root]')?.hasAttribute('data-motion-breakpoint')
  );
  await page.evaluate(() => document.fonts?.ready);
};

const collectPageState = async (page) => page.evaluate(() => {
  const root = document.querySelector('[data-case-study-motion-root]');
  const hiddenInViewport = Array.from(
    document.querySelectorAll('[data-reveal], [data-reveal-item]')
  ).filter((element) => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return rect.bottom > 0
      && rect.top < window.innerHeight
      && (style.opacity === '0' || style.visibility === 'hidden');
  }).length;

  return {
    viewport: { width: window.innerWidth, height: window.innerHeight },
    breakpoint: root?.getAttribute('data-motion-breakpoint'),
    reducedMotion: root?.getAttribute('data-motion-reduced'),
    triggerCount: Number(root?.getAttribute('data-motion-trigger-count') ?? -1),
    horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    hiddenInViewport,
  };
});

const normalContext = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'no-preference',
  recordVideo: { dir: rawVideoDir, size: { width: 1440, height: 900 } },
});
const normalPage = await normalContext.newPage();
normalPage.on('console', (message) => {
  if (message.type() === 'error' || message.type() === 'warning') {
    browserErrors.push({ mode: 'normal', type: message.type(), text: message.text() });
  }
});
normalPage.on('pageerror', (error) => {
  browserErrors.push({ mode: 'normal', type: 'pageerror', text: error.message });
});

await normalPage.goto(baseUrl, { waitUntil: 'networkidle' });
await waitForMotion(normalPage);
await normalPage.waitForTimeout(1400);
await normalPage.screenshot({ path: path.join(screenshotDir, 'normal-hero-1440x900.png') });
const normalInitial = await collectPageState(normalPage);

const hashOffsets = {};
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
  await normalPage.goto(`${baseUrl}#${id}`, { waitUntil: 'networkidle' });
  await waitForMotion(normalPage);
  await normalPage.waitForTimeout(2200);
  hashOffsets[id] = await normalPage.locator(`#${id}`).evaluate((element) =>
    Math.round(element.getBoundingClientRect().top)
  );

  if (id === 'donor-context') {
    await normalPage.screenshot({ path: path.join(screenshotDir, 'normal-drawer-1440x900.png') });
  }
  if (id === 'building-reusable-components') {
    await normalPage.screenshot({ path: path.join(screenshotDir, 'normal-systems-1440x900.png') });
  }
  if (id === 'impact') {
    await normalPage.screenshot({ path: path.join(screenshotDir, 'normal-impact-1440x900.png') });
  }
}

await normalPage.goto(`${baseUrl}#donor-context`, { waitUntil: 'networkidle' });
await waitForMotion(normalPage);
await normalPage.waitForTimeout(2200);
const animatedDemo = normalPage.locator('[data-testid="live-directory-demo-hero"]');
await animatedDemo.scrollIntoViewIfNeeded();
await normalPage.waitForTimeout(1400);
const visibleStageStart = await animatedDemo.locator('.donor-directory-playback > span').innerText();
await normalPage.waitForTimeout(1100);
const visibleStageEnd = await animatedDemo.locator('.donor-directory-playback > span').innerText();
await normalPage.evaluate(() => window.scrollTo(0, 0));
await normalPage.waitForTimeout(250);
const offscreenStageStart = await animatedDemo.locator('.donor-directory-playback > span').innerText();
await normalPage.waitForTimeout(1300);
const offscreenStageEnd = await animatedDemo.locator('.donor-directory-playback > span').innerText();

await animatedDemo.scrollIntoViewIfNeeded();
await normalPage.waitForTimeout(400);
await animatedDemo.getByRole('button', { name: 'Pause row-to-drawer animation' }).click();
const pauseControlWorks = await animatedDemo
  .getByRole('button', { name: 'Play row-to-drawer animation', exact: true })
  .isVisible();
await animatedDemo
  .getByRole('button', { name: 'Play row-to-drawer animation', exact: true })
  .click();
await animatedDemo.getByRole('button', { name: 'Replay row-to-drawer animation' }).click();
await normalPage.waitForTimeout(100);
const replayStage = await animatedDemo.locator('.donor-directory-playback > span').innerText();

const bulkDemo = normalPage.locator('[data-testid="live-directory-demo-bulk"]');
await bulkDemo.scrollIntoViewIfNeeded();
await normalPage.waitForTimeout(500);
const bulkCheckboxes = bulkDemo.locator('input[type="checkbox"]');
const bulkCheckboxCount = await bulkCheckboxes.count();
if (bulkCheckboxCount > 1) await bulkCheckboxes.nth(1).check();
const selectedBeforeLeaving = await bulkDemo.locator('input[type="checkbox"]:checked').count();
await normalPage.evaluate(() => window.scrollTo(0, 0));
await normalPage.waitForTimeout(350);
await bulkDemo.scrollIntoViewIfNeeded();
await normalPage.waitForTimeout(350);
const selectedAfterReturning = await bulkDemo.locator('input[type="checkbox"]:checked').count();

await normalPage.goto(baseUrl, { waitUntil: 'networkidle' });
await waitForMotion(normalPage);
await normalPage.waitForTimeout(900);
const maximumScroll = await normalPage.evaluate(() =>
  Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
);
const normalWalkthroughSteps = 200;
for (let step = 0; step <= normalWalkthroughSteps; step += 1) {
  const target = Math.round((maximumScroll * step) / normalWalkthroughSteps);
  await normalPage.evaluate((scrollTop) => window.scrollTo(0, scrollTop), target);
  await normalPage.waitForTimeout(250);
}
await normalPage.waitForTimeout(600);
const normalFinal = await collectPageState(normalPage);
const normalVideo = normalPage.video();
await normalPage.close();
await normalContext.close();
await normalVideo?.saveAs(path.join(walkthroughDir, 'donor-directory-normal-52s.webm'));

const mobileContext = await browser.newContext({
  viewport: { width: 390, height: 667 },
  reducedMotion: 'no-preference',
});
const mobilePage = await mobileContext.newPage();
mobilePage.on('pageerror', (error) => {
  browserErrors.push({ mode: 'mobile', type: 'pageerror', text: error.message });
});
await mobilePage.goto(baseUrl, { waitUntil: 'networkidle' });
await waitForMotion(mobilePage);
await mobilePage.waitForTimeout(1200);
await mobilePage.screenshot({ path: path.join(screenshotDir, 'normal-mobile-hero-390x667.png') });
const mobileInitial = await collectPageState(mobilePage);
await mobilePage.goto(`${baseUrl}#donor-context`, { waitUntil: 'networkidle' });
await waitForMotion(mobilePage);
await mobilePage.waitForTimeout(3600);
await mobilePage.screenshot({ path: path.join(screenshotDir, 'normal-mobile-drawer-390x667.png') });
await mobileContext.close();

const reducedContext = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'reduce',
  recordVideo: { dir: rawVideoDir, size: { width: 1440, height: 900 } },
});
const reducedPage = await reducedContext.newPage();
reducedPage.on('pageerror', (error) => {
  browserErrors.push({ mode: 'reduced', type: 'pageerror', text: error.message });
});
await reducedPage.goto(baseUrl, { waitUntil: 'networkidle' });
await waitForMotion(reducedPage);
await reducedPage.waitForTimeout(600);
const reducedInitial = await collectPageState(reducedPage);
await reducedPage.screenshot({ path: path.join(screenshotDir, 'reduced-hero-1440x900.png') });
const reducedMaximumScroll = await reducedPage.evaluate(() =>
  Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
);
const reducedWalkthroughSteps = 56;
for (let step = 0; step <= reducedWalkthroughSteps; step += 1) {
  const target = Math.round((reducedMaximumScroll * step) / reducedWalkthroughSteps);
  await reducedPage.evaluate((scrollTop) => window.scrollTo(0, scrollTop), target);
  await reducedPage.waitForTimeout(180);
}
await reducedPage.waitForTimeout(400);
const reducedFinal = await collectPageState(reducedPage);
const reducedVideo = reducedPage.video();
await reducedPage.close();
await reducedContext.close();
await reducedVideo?.saveAs(path.join(walkthroughDir, 'donor-directory-reduced-11s.webm'));

const reducedMobileContext = await browser.newContext({
  viewport: { width: 390, height: 667 },
  reducedMotion: 'reduce',
});
const reducedMobilePage = await reducedMobileContext.newPage();
await reducedMobilePage.goto(`${baseUrl}#donor-context`, { waitUntil: 'networkidle' });
await waitForMotion(reducedMobilePage);
await reducedMobilePage.waitForTimeout(2200);
const reducedMobile = await collectPageState(reducedMobilePage);
await reducedMobilePage.screenshot({
  path: path.join(screenshotDir, 'reduced-mobile-drawer-390x667.png'),
});
await reducedMobileContext.close();

const qa = {
  capturedAt: new Date().toISOString(),
  baseUrl,
  normalInitial,
  normalFinal,
  mobileInitial,
  reducedInitial,
  reducedFinal,
  reducedMobile,
  hashOffsets,
  interactionChecks: {
    animationAdvancedWhenVisible: visibleStageStart !== visibleStageEnd,
    animationPausedOffscreen: offscreenStageStart === offscreenStageEnd,
    pauseControlWorks,
    replayReturnsToResting: replayStage.trim().toLowerCase() === 'resting directory',
    bulkSelectionPersists: selectedBeforeLeaving > 0
      && selectedBeforeLeaving === selectedAfterReturning,
    selectedBeforeLeaving,
    selectedAfterReturning,
  },
  browserErrors,
};

await fs.writeFile(path.join(qaDir, 'browser-qa.json'), `${JSON.stringify(qa, null, 2)}\n`);
await browser.close();
console.log(JSON.stringify(qa, null, 2));
