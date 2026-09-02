import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.env.DEVIGN_URL ?? 'http://127.0.0.1:3000';
const outputDir = path.resolve('artifacts/home-dynamic-navigation');
const rawDir = path.join(outputDir, 'raw');

await fs.mkdir(rawDir, { recursive: true });

const browser = await chromium.launch({ headless: true });

const sectionY = async (page, id) => page.locator(`#${id}`).evaluate(
  element => element.getBoundingClientRect().top + window.scrollY - 96,
);

const smoothScroll = async (page, destination, duration) => {
  await page.evaluate(
    ({ destination: targetY, duration: scrollDuration }) => new Promise(resolve => {
      const startY = window.scrollY;
      const distance = targetY - startY;
      const startedAt = performance.now();
      const ease = value => value < 0.5
        ? 4 * value * value * value
        : 1 - Math.pow(-2 * value + 2, 3) / 2;

      const step = now => {
        const progress = Math.min(1, (now - startedAt) / scrollDuration);
        window.scrollTo(0, startY + distance * ease(progress));
        if (progress < 1) requestAnimationFrame(step);
        else resolve();
      };
      requestAnimationFrame(step);
    }),
    { destination, duration },
  );
};

const assertNoCompileOverlay = async page => {
  const overlayVisible = await page.evaluate(() =>
    document.body.innerText.includes('Compiled with problems:')
      || document.querySelector('iframe#webpack-dev-server-client-overlay') !== null
  );
  if (overlayVisible) throw new Error('Development compile overlay is visible.');
};

const recordWalkthrough = async ({ name, width, height }) => {
  const context = await browser.newContext({
    viewport: { width, height },
    recordVideo: { dir: rawDir, size: { width, height } },
  });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.locator('#services').waitFor({ state: 'attached' });
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(1000);
  await assertNoCompileOverlay(page);

  const services = await sectionY(page, 'services');
  await smoothScroll(page, services, 4300);
  await page.locator('[data-navigation-mode="contextual"]').waitFor();
  await page.waitForTimeout(1100);

  const serviceMenuTrigger = page.getByRole('button', {
    name: /open navigation menu for services/i,
  });
  await serviceMenuTrigger.click();
  await page.getByRole('dialog', { name: 'Navigation menu' }).waitFor();
  await page.waitForTimeout(1500);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(700);

  const projects = await sectionY(page, 'projects');
  await smoothScroll(page, projects, 2400);
  await page.getByRole('button', { name: /open navigation menu for projects/i }).waitFor();
  await page.waitForTimeout(1300);

  const process = await sectionY(page, 'process');
  await smoothScroll(page, process, 2200);
  await page.locator('[data-navigation-mode="general"]').waitFor();
  await page.waitForTimeout(1300);

  await smoothScroll(page, projects, 1900);
  await page.getByRole('button', { name: /open navigation menu for projects/i }).waitFor();
  await page.waitForTimeout(1000);

  if (pageErrors.length) {
    throw new Error(`${name} page errors: ${pageErrors.join('; ')}`);
  }

  const video = page.video();
  await context.close();
  await video?.saveAs(path.join(outputDir, `${name}.webm`));
};

const viewports = [
  { name: 'desktop-1440x900', width: 1440, height: 900 },
  { name: 'desktop-1280x800', width: 1280, height: 800 },
  { name: 'laptop-1024x768', width: 1024, height: 768 },
  { name: 'tablet-768x900', width: 768, height: 900 },
  { name: 'desktop-200-percent-zoom-equivalent', width: 720, height: 450 },
  { name: 'mobile-390x844', width: 390, height: 844 },
  { name: 'mobile-375x667', width: 375, height: 667 },
];

const qaResults = [];
const qaContext = await browser.newContext({ reducedMotion: 'reduce' });

for (const viewport of viewports) {
  console.log(`Checking ${viewport.name}...`);
  const page = await qaContext.newPage();
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 60_000 });
  await page.evaluate(() => document.fonts?.ready);
  await assertNoCompileOverlay(page);

  await page.evaluate(y => window.scrollTo(0, y), await sectionY(page, 'services'));
  await page.waitForTimeout(300);
  const contextual = page.locator('[data-navigation-mode="contextual"]');
  const serviceNav = await contextual.evaluate(element => {
    const bounds = element.getBoundingClientRect();
    return {
      height: Math.round(bounds.height),
      left: Math.round(bounds.left),
      right: Math.round(bounds.right),
      viewportWidth: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      mode: element.getAttribute('data-navigation-mode'),
    };
  });

  const trigger = page.getByRole('button', { name: /open navigation menu for services/i });
  await trigger.click();
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  const focusRestored = await trigger.evaluate(element => document.activeElement === element);

  await page.evaluate(y => window.scrollTo(0, y), await sectionY(page, 'projects'));
  await page.waitForTimeout(250);
  const projectsTitleVisible = await page
    .getByRole('button', { name: /open navigation menu for projects/i })
    .isVisible();

  await page.evaluate(y => window.scrollTo(0, y), await sectionY(page, 'process'));
  await page.waitForTimeout(250);
  let processButton;
  if (viewport.width < 840) {
    await page.getByRole('button', { name: 'Open menu' }).click();
    processButton = page.getByRole('dialog', { name: 'Navigation menu' })
      .getByRole('button', { name: 'Process', exact: true });
  } else {
    processButton = page.getByRole('button', { name: 'Process', exact: true });
  }
  const processIsCurrent = await processButton.getAttribute('aria-current');

  qaResults.push({
    viewport,
    contextual: serviceNav.mode === 'contextual',
    navbarHeight: serviceNav.height,
    withinViewport: serviceNav.left >= 0 && serviceNav.right <= serviceNav.viewportWidth,
    noHorizontalOverflow: serviceNav.documentWidth <= serviceNav.viewportWidth,
    focusRestored,
    projectsTitleVisible,
    processIsCurrent: processIsCurrent === 'location',
  });

  if (viewport.width < 840) await page.keyboard.press('Escape');
  await page.close();
}

await qaContext.close();
await recordWalkthrough({ name: 'home-navigation-desktop-1440x900', width: 1440, height: 900 });
await recordWalkthrough({ name: 'home-navigation-mobile-390x844', width: 390, height: 844 });
await browser.close();

await fs.writeFile(
  path.join(outputDir, 'qa-results.json'),
  `${JSON.stringify(qaResults, null, 2)}\n`,
  'utf8',
);

const failed = qaResults.filter(result =>
  !result.contextual
  || result.navbarHeight !== 60
  || !result.withinViewport
  || !result.noHorizontalOverflow
  || !result.focusRestored
  || !result.projectsTitleVisible
  || !result.processIsCurrent
);

if (failed.length) {
  throw new Error(`Navigation QA failed: ${JSON.stringify(failed)}`);
}

console.log(`Recorded walkthroughs and verified ${qaResults.length} responsive viewports.`);
