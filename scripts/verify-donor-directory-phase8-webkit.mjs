import fs from 'node:fs/promises';
import path from 'node:path';
import { webkit } from 'playwright';

const baseUrl = process.env.DONOR_DIRECTORY_URL
  ?? 'http://127.0.0.1:3000/case-studies/donor-directory';
const qaPath = path.resolve('artifacts/phase8/qa/webkit-qa.json');
const screenshotPath = path.resolve('artifacts/phase8/screenshots/webkit-desktop-1440x900.png');
const browser = await webkit.launch({ headless: true });
const errors = [];

const inspect = async (reducedMotion, viewport) => {
  const context = await browser.newContext({ viewport, reducedMotion });
  const page = await context.newPage();
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      errors.push({ mode: reducedMotion, type: message.type(), text: message.text() });
    }
  });
  page.on('pageerror', (error) => {
    errors.push({ mode: reducedMotion, type: 'pageerror', text: error.message });
  });

  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.waitForFunction(() =>
    document.querySelector('[data-case-study-motion-root]')?.hasAttribute('data-motion-breakpoint')
  );
  await page.waitForTimeout(900);

  if (reducedMotion === 'no-preference' && viewport.width === 1440) {
    await page.screenshot({ path: screenshotPath });
  }

  const result = await page.evaluate(() => {
    const root = document.querySelector('[data-case-study-motion-root]');
    return {
      viewport: { width: window.innerWidth, height: window.innerHeight },
      breakpoint: root?.getAttribute('data-motion-breakpoint'),
      reducedMotion: root?.getAttribute('data-motion-reduced'),
      triggerCount: Number(root?.getAttribute('data-motion-trigger-count') ?? -1),
      horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });

  const maximumScroll = await page.evaluate(() =>
    Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
  );
  for (let step = 0; step <= 32; step += 1) {
    await page.evaluate(
      ({ scrollTop }) => window.scrollTo(0, scrollTop),
      { scrollTop: Math.round((maximumScroll * step) / 32) }
    );
    await page.waitForTimeout(90);
  }
  result.hiddenAtEnd = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-reveal], [data-reveal-item]')).filter((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.bottom > 0
        && rect.top < window.innerHeight
        && (style.opacity === '0' || style.visibility === 'hidden');
    }).length
  );

  await context.close();
  return result;
};

const qa = {
  capturedAt: new Date().toISOString(),
  engine: 'Playwright WebKit',
  desktop: await inspect('no-preference', { width: 1440, height: 900 }),
  mobile: await inspect('no-preference', { width: 390, height: 667 }),
  reducedDesktop: await inspect('reduce', { width: 1440, height: 900 }),
  errors,
};

await fs.writeFile(qaPath, `${JSON.stringify(qa, null, 2)}\n`);
await browser.close();
console.log(JSON.stringify(qa, null, 2));
