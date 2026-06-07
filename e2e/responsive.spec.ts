import { test, expect, devices } from '@playwright/test';

const widths = [
  { name: 'iPhone SE', viewport: { width: 320, height: 568 } },
  { name: 'iPhone 12 mini', viewport: { width: 375, height: 812 } },
  { name: 'Pixel 7', viewport: devices['Pixel 7'].viewport },
  { name: 'iPad', viewport: { width: 768, height: 1024 } },
];

const paths = ['/'];

for (const w of widths) {
  test.describe(`responsive @ ${w.name} (${w.viewport.width}px)`, () => {
    test.use({ viewport: w.viewport });

    for (const path of paths) {
      test(`${path} no horizontal overflow`, async ({ page }) => {
        await page.goto(path);
        await page.waitForLoadState('networkidle');
        const overflow = await page.evaluate(() => {
          const html = document.documentElement;
          const body = document.body;
          return {
            scrollW: Math.max(html.scrollWidth, body.scrollWidth),
            clientW: html.clientWidth,
          };
        });
        expect(overflow.scrollW).toBeLessThanOrEqual(overflow.clientW + 1);
      });
    }
  });
}
