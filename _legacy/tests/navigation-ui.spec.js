const { test, expect } = require('@playwright/test');

test.describe('Navigation and UI Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  async function clickTab(page, tabName) {
    const isMobile = await page.evaluate(() => window.innerWidth < 640);
    if (isMobile) {
      await page.click('#mobile-menu-btn', { force: true }).catch(() => {});
    }
    await page.click(`a[data-tab="${tabName}"]`, { force: true });
  }

  test('should switch tabs successfully', async ({ page }) => {
    // Pipeline
    await clickTab(page, 'pipeline');
    await expect(page.locator('#pipeline-view')).toBeVisible();
    await expect(page.locator('#dashboard-view')).toBeHidden();

    // Insights
    await clickTab(page, 'insights');
    await expect(page.locator('#insights-view')).toBeVisible();
    await expect(page.locator('#pipeline-view')).toBeHidden();

    // Dashboard
    await clickTab(page, 'dashboard');
    await expect(page.locator('#dashboard-view')).toBeVisible();
    await expect(page.locator('#insights-view')).toBeHidden();
  });

  test('should filter deals using global search', async ({ page }) => {
    await clickTab(page, 'pipeline');
    
    // Add a specific deal to search
    await page.click('button:has-text("New Deal")', { force: true });
    await page.fill('#deal-title', 'UniqueSearchTestCorp');
    await page.fill('#deal-amount', '1000000');
    await page.selectOption('#deal-source', 'referral');
    await page.selectOption('#deal-stage', 'new-lead');
    await page.click('button:has-text("Create Lead")', { force: true });

    // Search for it
    await page.fill('#global-search', 'UniqueSearchTestCorp');
    
    // The list should shrink to 1
    await expect(page.locator('.tilt-card, .interactive-tilt-card')).toHaveCount(1, { timeout: 10000 });
  });
});
