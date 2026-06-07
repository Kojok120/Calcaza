import { test, expect } from '@playwright/test';
import { SITE_NAME } from '../lib/site';

test.describe('Home page', () => {
  test('returns < 400 and renders site brand link', async ({ page }) => {
    const resp = await page.goto('/');
    expect(resp?.status()).toBeLessThan(400);

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: SITE_NAME }).first()).toBeVisible();
  });

  test('html has dir=rtl and lang=ar', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'rtl');
    await expect(html).toHaveAttribute('lang', 'ar');
  });

  test('footer links to all marketing pages', async ({ page }) => {
    await page.goto('/');
    for (const name of ['من نحن', 'سياسة الخصوصية', 'إخلاء المسؤولية', 'تواصل معنا']) {
      await expect(page.getByRole('link', { name })).toBeVisible();
    }
  });
});
