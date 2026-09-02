import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.env.DEVIGN_URL ?? 'http://127.0.0.1:3000';
const outputDir = path.resolve('artifacts/service-chapters');
const screenshotsDir = path.join(outputDir, 'screenshots');
await fs.mkdir(screenshotsDir, { recursive: true });

const branches = [
  { id: 'websites', label: 'Websites', chapter: 1 },
  { id: 'web-applications', label: 'Web Applications', chapter: 2 },
  { id: 'branding-marketing', label: 'Branding & Marketing', chapter: 3 },
  { id: 'motion-video', label: 'Motion & Video', chapter: 4 },
];

const viewports = [
  { name: 'desktop-1440x900', width: 1440, height: 900 },
  { name: 'desktop-1280x800', width: 1280, height: 800 },
  { name: 'laptop-1024x768', width: 1024, height: 768 },
  { name: 'tablet-768x900', width: 768, height: 900 },
  { name: 'zoom-200-percent-equivalent', width: 720, height: 450 },
  { name: 'mobile-390x844', width: 390, height: 844 },
  { name: 'mobile-375x667', width: 375, height: 667 },
];

const browser = await chromium.launch({ headless: true });
const results = [];

const scrollToChapter = async (page, id) => {
  const y = await page.locator(`#service-${id}`).evaluate(
    element => element.getBoundingClientRect().top + window.scrollY,
  );
  await page.evaluate(targetY => window.scrollTo(0, targetY + 1), y);
  await page.waitForFunction(
    serviceId => document.querySelector('.service-chapter-sequence')?.getAttribute('data-active-service') === serviceId,
    id,
  );
  await page.waitForTimeout(120);
};

for (const viewport of viewports) {
  console.log(`Checking ${viewport.name}...`);
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.locator('#service-websites').waitFor();
  await page.evaluate(() => document.fonts?.ready);
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });

  const forward = [];
  for (const branch of branches) {
    await scrollToChapter(page, branch.id);
    const activePanelCount = await page.locator('[data-service-panel][aria-hidden="false"]').count();
    const activeNavCount = await page.locator(`[data-service-id="${branch.id}"][aria-current="location"]`).count();
    const progress = Number(await page.locator('[data-testid="context-progress-indicator"]').getAttribute('aria-valuenow'));
    const stageMetrics = await page.locator('.service-chapter-stage').evaluate(element => {
      const stage = element.getBoundingClientRect();
      const activePanel = element.querySelector('[data-service-panel][aria-hidden="false"]');
      const copy = activePanel?.querySelector('.service-chapter-copy')?.getBoundingClientRect();
      const preview = activePanel?.querySelector('.service-chapter-preview')?.getBoundingClientRect();
      const isWithinStage = rect => Boolean(
        rect
        && rect.top >= stage.top - 1
        && rect.bottom <= stage.bottom + 1
        && rect.left >= stage.left - 1
        && rect.right <= stage.right + 1
      );
      return {
        activeContentWithinStage: isWithinStage(copy) && isWithinStage(preview),
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
      };
    });
    const serviceNavMetrics = viewport.width >= 840
      ? await page.locator('[data-navigation-mode="contextual"]').evaluate(nav => {
        const buttons = Array.from(nav.querySelectorAll('[data-service-id]'))
          .filter(element => element.getBoundingClientRect().width > 0);
        const layer = buttons[0]?.parentElement?.getBoundingClientRect();
        const first = buttons[0]?.getBoundingClientRect();
        const last = buttons.at(-1)?.getBoundingClientRect();
        const active = nav.querySelector('[data-service-id][aria-current="location"]')?.getBoundingClientRect();
        const gaps = buttons.slice(1).map((button, index) => (
          button.getBoundingClientRect().left - buttons[index].getBoundingClientRect().right
        ));
        if (!layer || !first || !last || !active) return null;
        const leftClearance = first.left - layer.left;
        const rightClearance = layer.right - last.right;
        return {
          layerWidth: Math.round(layer.width),
          leftClearance: Math.round(leftClearance),
          rightClearance: Math.round(rightClearance),
          balancedEdges: Math.abs(leftClearance - rightClearance) <= 18,
          minimumGap: Math.round(Math.min(...gaps)),
          activeClearanceLeft: Math.round(active.left - layer.left),
          activeClearanceRight: Math.round(layer.right - active.right),
          activeCapsuleCount: nav.querySelectorAll('[data-active-service-capsule="true"]').length,
        };
      })
      : null;
    forward.push({
      id: branch.id,
      activePanelCount,
      activeNavCount,
      chapter: progress,
      expectedChapter: branch.chapter,
      activeContentWithinStage: stageMetrics.activeContentWithinStage,
      noHorizontalOverflow: stageMetrics.documentWidth <= stageMetrics.viewportWidth,
      serviceNavMetrics,
    });

    if (viewport.name === 'desktop-1440x900') {
      await page.screenshot({
        path: path.join(screenshotsDir, `${viewport.name}-${branch.id}.png`),
      });
    }
  }

  const reverse = [];
  for (const branch of [...branches].reverse()) {
    await scrollToChapter(page, branch.id);
    reverse.push(await page.locator('.service-chapter-sequence').getAttribute('data-active-service'));
  }

  await scrollToChapter(page, 'web-applications');
  if (viewport.width >= 840) {
    await page.getByRole('button', { name: 'Branding & Marketing', exact: true }).click();
  } else {
    await page.getByRole('button', { name: /open navigation menu for services/i }).click();
    const menu = page.getByRole('dialog', { name: 'Navigation menu' });
    const activeMenuItem = menu.getByRole('button', { name: 'Web Applications', exact: true });
    if (await activeMenuItem.getAttribute('aria-current') !== 'location') {
      throw new Error(`${viewport.name}: mobile menu did not reflect the active service.`);
    }
    await menu.getByRole('button', { name: 'Branding & Marketing', exact: true }).click();
  }
  await page.waitForFunction(() =>
    document.querySelector('.service-chapter-sequence')?.getAttribute('data-active-service') === 'branding-marketing'
  );
  const chapterLinkWorked = (await page.locator('.service-chapter-sequence').getAttribute('data-active-service')) === 'branding-marketing';

  await page.getByRole('button', { name: /open navigation menu for services/i }).click();
  await page.getByRole('dialog', { name: 'Navigation menu' })
    .getByRole('button', { name: 'Projects', exact: true })
    .click();
  await page.waitForTimeout(180);
  const projectsTitleVisible = await page.getByRole('button', { name: /open navigation menu for projects/i }).isVisible();

  await page.getByRole('button', { name: /open navigation menu for projects/i }).click();
  await page.getByRole('dialog', { name: 'Navigation menu' })
    .getByRole('button', { name: 'Process', exact: true })
    .click();
  await page.waitForTimeout(180);
  const returnedToGeneral = await page.locator('[data-navigation-mode="general"]').isVisible();

  results.push({
    viewport,
    forward,
    reverse,
    chapterLinkWorked,
    projectsTitleVisible,
    returnedToGeneral,
    pageErrors,
  });
  await context.close();
}

await browser.close();

// Verify normal-motion progression in a fresh browser: wheel input remains native from the first
// frame, ScrollTrigger snaps to one chapter, and the overlapping reveal settles.
const motionBrowser = await chromium.launch({ headless: true });
const motionContext = await motionBrowser.newContext({
  viewport: { width: 1440, height: 900 },
  hasTouch: true,
});
const motionPage = await motionContext.newPage();
await motionPage.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 });
await motionPage.locator('#service-websites').waitFor();
await motionPage.evaluate(() => document.fonts?.ready);
await motionPage.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
await motionPage.waitForTimeout(1_200);

const websitesY = await motionPage.locator('#service-websites').evaluate(
  element => element.getBoundingClientRect().top + window.scrollY,
);
await motionPage.evaluate(targetY => window.scrollTo(0, targetY + 1), websitesY);
await motionPage.waitForFunction(() =>
  document.querySelector('.service-chapter-sequence')?.getAttribute('data-active-service') === 'websites'
);
await motionPage.getByRole('button', { name: /open navigation menu for services/i }).waitFor();
await motionPage.waitForTimeout(700);
await motionPage.screenshot({ path: path.join(screenshotsDir, 'normal-motion-websites.png') });

const forwardStartedAt = Date.now();
const forwardStartY = await motionPage.evaluate(() => window.scrollY);
await motionPage.mouse.wheel(0, 80);
await motionPage.waitForTimeout(50);
const forwardAcknowledgedY = await motionPage.evaluate(() => window.scrollY);
for (let index = 0; index < 12; index += 1) {
  const active = await motionPage.locator('.service-chapter-sequence').getAttribute('data-active-service');
  if (active === 'web-applications') break;
  if (active !== 'websites') throw new Error(`Forward gesture skipped to ${active}.`);
  await motionPage.mouse.wheel(0, 80);
  await motionPage.waitForTimeout(42);
}
await motionPage.waitForFunction(() =>
  document.querySelector('.service-chapter-sequence')?.getAttribute('data-active-service') === 'web-applications'
);
await motionPage.waitForTimeout(90);
const forwardMidState = await motionPage.evaluate(() => ({
  scrollY: window.scrollY,
  activeService: document.querySelector('.service-chapter-sequence')?.getAttribute('data-active-service'),
  activePanelCount: document.querySelectorAll('[data-service-panel][aria-hidden="false"]').length,
  activeNav: document.querySelector('[data-service-id][aria-current="location"]')?.getAttribute('data-service-id'),
  chapter: document.querySelector('[data-testid="context-progress-indicator"]')?.getAttribute('aria-valuenow'),
}));
await motionPage.screenshot({ path: path.join(screenshotsDir, 'normal-motion-web-applications.png') });
await motionPage.waitForTimeout(1_200);
const forwardDurationMs = Date.now() - forwardStartedAt;
const forwardSettledService = await motionPage.locator('.service-chapter-sequence').getAttribute('data-active-service');
await motionPage.waitForTimeout(120);

for (const branch of branches.slice(2)) {
  await motionPage.getByRole('button', { name: branch.label, exact: true }).click();
  await motionPage.waitForFunction(
    serviceId => document.querySelector('.service-chapter-sequence')?.getAttribute('data-active-service') === serviceId,
    branch.id,
    { timeout: 15_000 },
  );
  await motionPage.waitForTimeout(700);
  const settledService = await motionPage.locator('.service-chapter-sequence').getAttribute('data-active-service');
  if (settledService !== branch.id) {
    const diagnostics = await motionPage.evaluate(() => ({
      scrollY: window.scrollY,
      rootTop: document.querySelector('.service-chapter-sequence')?.getBoundingClientRect().top,
      targetTops: Array.from(document.querySelectorAll('[data-service-chapter]')).map(element => ({
        id: element.id,
        top: element.getBoundingClientRect().top,
      })),
    }));
    throw new Error(`Normal-motion ${branch.id} did not settle (active: ${settledService}, diagnostics: ${JSON.stringify(diagnostics)}).`);
  }
  await motionPage.screenshot({
    path: path.join(screenshotsDir, `normal-motion-${branch.id}.png`),
  });
}

const reverseStartedAt = Date.now();
const reverseStartY = await motionPage.evaluate(() => window.scrollY);
await motionPage.mouse.wheel(0, -80);
await motionPage.waitForTimeout(50);
const reverseAcknowledgedY = await motionPage.evaluate(() => window.scrollY);
for (let index = 0; index < 12; index += 1) {
  const active = await motionPage.locator('.service-chapter-sequence').getAttribute('data-active-service');
  if (active === 'branding-marketing') break;
  if (active !== 'motion-video') throw new Error(`Reverse gesture skipped to ${active}.`);
  await motionPage.mouse.wheel(0, -80);
  await motionPage.waitForTimeout(42);
}
await motionPage.waitForFunction(() =>
  document.querySelector('.service-chapter-sequence')?.getAttribute('data-active-service') === 'branding-marketing'
);
await motionPage.waitForTimeout(180);
const reverseMidService = await motionPage.locator('.service-chapter-sequence').getAttribute('data-active-service');
await motionPage.waitForTimeout(1_200);
const reverseDurationMs = Date.now() - reverseStartedAt;
const guidedTransition = {
  forwardMidState,
  nativeForwardScrollAcknowledged: forwardAcknowledgedY > forwardStartY + 20,
  forwardDurationMs,
  forwardSettledService,
  reverseMidService,
  nativeReverseScrollAcknowledged: reverseAcknowledgedY < reverseStartY - 20,
  reverseDurationMs,
  reverseSettledService: await motionPage.locator('.service-chapter-sequence').getAttribute('data-active-service'),
};
await motionContext.close();
await motionBrowser.close();

await fs.writeFile(
  path.join(outputDir, 'qa-results.json'),
  `${JSON.stringify({ viewports: results, guidedTransition }, null, 2)}\n`,
  'utf8',
);

const failures = results.filter(result =>
  result.pageErrors.length
  || !result.chapterLinkWorked
  || !result.projectsTitleVisible
  || !result.returnedToGeneral
  || result.reverse.join(',') !== 'motion-video,branding-marketing,web-applications,websites'
  || result.forward.some(chapter =>
    chapter.activePanelCount !== 1
    || chapter.activeNavCount !== 1
    || chapter.chapter !== chapter.expectedChapter
    || !chapter.activeContentWithinStage
    || !chapter.noHorizontalOverflow
    || (chapter.serviceNavMetrics && (
      chapter.serviceNavMetrics.layerWidth < 580
      || chapter.serviceNavMetrics.leftClearance < 7
      || chapter.serviceNavMetrics.rightClearance < 7
      || !chapter.serviceNavMetrics.balancedEdges
      || chapter.serviceNavMetrics.minimumGap < 5
      || chapter.serviceNavMetrics.activeClearanceLeft < 7
      || chapter.serviceNavMetrics.activeClearanceRight < 7
      || chapter.serviceNavMetrics.activeCapsuleCount !== 1
    ))
  )
);

if (failures.length) throw new Error(`Service chapter QA failed: ${JSON.stringify(failures)}`);
if (
  forwardMidState.activeService !== 'web-applications'
  || forwardMidState.activePanelCount !== 1
  || forwardMidState.activeNav !== 'web-applications'
  || forwardMidState.chapter !== '2'
  || !guidedTransition.nativeForwardScrollAcknowledged
  || !['web-applications', 'branding-marketing'].includes(forwardSettledService)
  || forwardDurationMs < 500
  || forwardDurationMs > 2_500
  || reverseMidService !== 'branding-marketing'
  || !guidedTransition.nativeReverseScrollAcknowledged
  || guidedTransition.reverseSettledService !== 'branding-marketing'
  || reverseDurationMs < 500
  || reverseDurationMs > 2_500
) throw new Error(`Guided transition QA failed: ${JSON.stringify(guidedTransition)}`);
console.log(`Verified four service chapters at ${viewports.length} viewport configurations.`);
