import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const url = process.env.DONOR_DIRECTORY_URL ?? 'http://127.0.0.1:4173/case-studies/donor-directory/';
const report = [];

for (const width of [1440, 1024, 768, 390]) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce', acceptDownloads: true });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(url, { waitUntil: 'networkidle' });
  const demo = page.locator('[data-testid="live-directory-demo-discovery"]');
  await demo.scrollIntoViewIfNeeded();
  await demo.locator('input[aria-label="Search donors"]').waitFor();
  const layout = await page.evaluate(() => {
    const shell = document.querySelector('[data-testid="live-directory-demo-discovery"] .directory-demo-shell');
    return {
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      shellHeight: Math.round(shell.getBoundingClientRect().height),
      shellScrollHeight: shell.scrollHeight,
      pageHeight: document.documentElement.scrollHeight,
    };
  });
  await demo.screenshot({ path: `/tmp/donor-discovery-${width}.png` });

  let mobileDrawerTop = null;
  if (width === 390) {
    await demo.getByRole('button', { name: 'Open details for Sofia Martinez' }).click();
    mobileDrawerTop = await demo.getByRole('dialog', { name: 'Sofia Martinez' })
      .evaluate((element) => Math.round(element.getBoundingClientRect().top));
    await demo.getByRole('button', { name: 'Close donor details' }).click();
  }

  await demo.getByRole('searchbox', { name: 'Search donors' }).fill('Martinez');
  await demo.getByRole('button', { name: /Filters/ }).click();
  await demo.getByRole('button', { name: 'High engagement' }).click();
  const filtered = await demo.getByText('2 matching donors').isVisible();
  const donor = demo.getByRole('button', { name: width <= 760 ? 'Open details for Sofia Martinez' : /Sofia Martinez/ });
  await donor.click();
  const drawer = await demo.getByRole('dialog', { name: 'Sofia Martinez' }).isVisible();
  await demo.getByRole('button', { name: 'Close donor details' }).click();
  const restored = await demo.getByRole('searchbox', { name: 'Search donors' }).inputValue() === 'Martinez'
    && await demo.getByText('2 matching donors').isVisible();
  await demo.getByRole('checkbox', { name: 'Select Sofia Martinez' }).check();
  const selected = await demo.getByRole('region', { name: 'Bulk actions' }).getByText('1 selected').isVisible();
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    demo.getByRole('button', { name: 'Export CSV' }).click(),
  ]);
  const exported = download.suggestedFilename() === 'donor-directory-demo-selection.csv';
  await donor.focus();
  await page.keyboard.press('Enter');
  await demo.getByRole('dialog', { name: 'Sofia Martinez' }).waitFor();
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => {
    const active = document.activeElement;
    return active instanceof HTMLButtonElement
      && (active.getAttribute('aria-label') === 'Open details for Sofia Martinez'
        || active.textContent?.includes('Sofia Martinez'));
  });
  const focusReturned = await donor.evaluate((element) => document.activeElement === element);
  await page.getByRole('button', { name: 'Open section navigation' }).click();
  await page.getByRole('menuitem', { name: 'Reflection' }).click();
  const navigation = await page.evaluate(() => window.location.hash === '#outcome');
  report.push({ width, layout, mobileDrawerTop, filtered, drawer, restored, selected, exported, focusReturned, navigation, errors });
  await context.close();
}

console.log(JSON.stringify(report, null, 2));
await browser.close();
if (report.some((entry) => entry.layout.overflow > 0 || entry.layout.shellScrollHeight > entry.layout.shellHeight + 2
  || entry.errors.length || !entry.filtered || !entry.drawer || !entry.restored || !entry.selected || !entry.exported
  || !entry.focusReturned || !entry.navigation || (entry.width === 390 && entry.mobileDrawerTop !== 0))) {
  process.exitCode = 1;
}
