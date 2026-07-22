import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.env.DONOR_DIRECTORY_URL
  ?? 'http://localhost:3000/case-studies/donor-directory';
const artifactRoot = path.resolve('artifacts/phase8b');
const screenshotDir = path.join(artifactRoot, 'screenshots');
const qaDir = path.join(artifactRoot, 'qa');
await Promise.all([screenshotDir, qaDir].map((directory) => fs.mkdir(directory, { recursive: true })));

const browser = await chromium.launch({ headless: true });
const errors = [];

const attachErrorCollection = (page, mode) => {
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      errors.push({ mode, type: message.type(), text: message.text() });
    }
  });
  page.on('pageerror', (error) => errors.push({ mode, type: 'pageerror', text: error.message }));
};

const waitForMotion = async (page) => {
  await page.waitForLoadState('networkidle');
  await page.waitForFunction(() =>
    document.querySelector('[data-case-study-motion-root]')?.hasAttribute('data-motion-breakpoint')
  );
  await page.evaluate(() => document.fonts?.ready);
};

const collectState = (page) => page.evaluate(() => {
  const root = document.querySelector('[data-case-study-motion-root]');
  const revealElements = Array.from(root?.querySelectorAll('[data-reveal]') ?? []);
  const hiddenInViewport = revealElements.filter((element) => {
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
    revealElementCount: revealElements.length,
    visualCount: root?.querySelectorAll('[data-reveal="visual"]').length ?? -1,
    nestedRevealCount: revealElements.filter((element) =>
      element.parentElement?.closest('[data-reveal]')
    ).length,
    vocabulary: [...new Set(revealElements.map((element) => element.getAttribute('data-reveal')))],
    horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    hiddenInViewport,
    compileOverlayVisible: document.body.innerText.includes('Compiled with problems:')
      || document.querySelector('iframe#webpack-dev-server-client-overlay') !== null,
    pageHeight: document.documentElement.scrollHeight,
  };
});

const viewportMatrix = [];
for (const viewport of [
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 834, height: 1112 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
]) {
  const context = await browser.newContext({ viewport, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  attachErrorCollection(page, `normal-${viewport.width}x${viewport.height}`);
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await waitForMotion(page);
  await page.waitForTimeout(900);
  viewportMatrix.push(await collectState(page));
  if (viewport.width === 1440) {
    await page.screenshot({ path: path.join(screenshotDir, 'normal-hero-1440x900.png') });
  }
  if (viewport.width === 390) {
    await page.screenshot({ path: path.join(screenshotDir, 'normal-mobile-hero-390x844.png') });
  }
  await context.close();
}

const reducedMatrix = [];
for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
  const page = await context.newPage();
  attachErrorCollection(page, `reduced-${viewport.width}x${viewport.height}`);
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await waitForMotion(page);
  await page.waitForTimeout(400);
  reducedMatrix.push(await collectState(page));
  if (viewport.width === 1440) {
    await page.screenshot({ path: path.join(screenshotDir, 'reduced-hero-1440x900.png') });
  }
  await context.close();
}

const interactionContext = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'no-preference',
});
const interactionPage = await interactionContext.newPage();
attachErrorCollection(interactionPage, 'interaction');
await interactionPage.goto(`${baseUrl}#donor-context`, { waitUntil: 'networkidle' });
await waitForMotion(interactionPage);
await interactionPage.waitForTimeout(1400);
await interactionPage.screenshot({ path: path.join(screenshotDir, 'normal-drawer-1440x900.png') });

const animatedDemo = interactionPage.locator('[data-testid="live-directory-demo-hero"]');
await animatedDemo.scrollIntoViewIfNeeded();
await animatedDemo.getByRole('button', { name: 'Pause row-to-drawer animation' }).click();
const pauseControlWorks = await animatedDemo
  .getByRole('button', { name: 'Play row-to-drawer animation', exact: true })
  .isVisible();
await animatedDemo.getByRole('button', { name: 'Play row-to-drawer animation', exact: true }).click();
await animatedDemo.getByRole('button', { name: 'Replay row-to-drawer animation' }).click();
await interactionPage.waitForTimeout(120);
const replayStage = await animatedDemo.locator('.donor-directory-playback > span').innerText();

const bulkDemo = interactionPage.locator('[data-testid="live-directory-demo-bulk"]');
await bulkDemo.scrollIntoViewIfNeeded();
await interactionPage.waitForTimeout(500);
const bulkCheckboxes = bulkDemo.locator('input[type="checkbox"]');
const checkboxCount = await bulkCheckboxes.count();
if (checkboxCount > 1) await bulkCheckboxes.nth(1).check();
const selectedBeforeLeaving = await bulkDemo.locator('input[type="checkbox"]:checked').count();
await interactionPage.evaluate(() => window.scrollTo(0, 0));
await bulkDemo.scrollIntoViewIfNeeded();
await interactionPage.waitForTimeout(350);
const selectedAfterReturning = await bulkDemo.locator('input[type="checkbox"]:checked').count();

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
  const hashPage = await interactionContext.newPage();
  attachErrorCollection(hashPage, `hash-${id}`);
  await hashPage.goto(`${baseUrl}#${id}`, { waitUntil: 'networkidle' });
  await waitForMotion(hashPage);
  await hashPage.waitForTimeout(2400);
  directHashOffsets[id] = await hashPage.locator(`#${id}`).evaluate((element) =>
    Math.round(element.getBoundingClientRect().top)
  );
  if (id === 'building-reusable-components') {
    await hashPage.screenshot({ path: path.join(screenshotDir, 'normal-systems-1440x900.png') });
  }
  if (id === 'accessibility-and-polish') {
    await hashPage.screenshot({ path: path.join(screenshotDir, 'normal-quality-1440x900.png') });
  }
  if (id === 'impact') {
    await hashPage.screenshot({ path: path.join(screenshotDir, 'normal-impact-1440x900.png') });
  }
  await hashPage.close();
}

await interactionPage.goto(baseUrl, { waitUntil: 'networkidle' });
await waitForMotion(interactionPage);
await interactionPage.waitForTimeout(600);
const maximumScroll = await interactionPage.evaluate(() =>
  Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
);
let fastScrollMinimumEditorialOpacity = 1;
let fastScrollHiddenEditorialFrames = 0;
for (let step = 1; step <= 20; step += 1) {
  await interactionPage.evaluate(
    ({ scrollTop }) => window.scrollTo(0, scrollTop),
    { scrollTop: Math.round((maximumScroll * step) / 20) }
  );
  await interactionPage.waitForTimeout(65);
  const sample = await interactionPage.evaluate(() => {
    const editorial = Array.from(document.querySelectorAll(
      '[data-reveal="intro"], [data-reveal="card-group"], [data-reveal="text"]'
    )).filter((element) => {
      const rect = element.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight;
    });
    const opacities = editorial.map((element) => Number(getComputedStyle(element).opacity));
    return {
      minimumOpacity: opacities.length ? Math.min(...opacities) : 1,
      hiddenCount: opacities.filter((opacity) => opacity === 0).length,
    };
  });
  fastScrollMinimumEditorialOpacity = Math.min(
    fastScrollMinimumEditorialOpacity,
    sample.minimumOpacity
  );
  if (sample.hiddenCount > 0) fastScrollHiddenEditorialFrames += 1;
}
await interactionPage.waitForTimeout(800);
const fastScrollSettled = await collectState(interactionPage);

const comparisonTargets = await interactionPage.evaluate(() => {
  const maximum = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const target = (selector) => {
    const element = document.querySelector(selector);
    const absoluteTop = element ? element.getBoundingClientRect().top + window.scrollY : null;
    return absoluteTop === null ? null : Math.max(0, Math.min(1, absoluteTop / maximum));
  };
  return {
    sectionIntro: target('#building-reusable-components'),
    cardGroup: target('#accessibility-and-polish [data-reveal="card-group"]'),
    majorVisual: target('[data-asset-id="donor-directory-component-sheet"]'),
  };
});

await interactionContext.close();

const qa = {
  capturedAt: new Date().toISOString(),
  baseUrl,
  viewportMatrix,
  reducedMatrix,
  directHashOffsets,
  interactionChecks: {
    pauseControlWorks,
    replayReturnsToResting: replayStage.trim().toLowerCase() === 'resting directory',
    replayStage,
    bulkSelectionPersists: selectedBeforeLeaving > 0
      && selectedBeforeLeaving === selectedAfterReturning,
    selectedBeforeLeaving,
    selectedAfterReturning,
  },
  fastScroll: {
    minimumEditorialOpacity: fastScrollMinimumEditorialOpacity,
    hiddenEditorialFrames: fastScrollHiddenEditorialFrames,
    settled: fastScrollSettled,
  },
  comparisonTargets,
  errors,
};

await fs.writeFile(path.join(qaDir, 'browser-qa.json'), `${JSON.stringify(qa, null, 2)}\n`);
await browser.close();
console.log(JSON.stringify(qa, null, 2));
