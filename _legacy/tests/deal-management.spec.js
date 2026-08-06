const { test, expect } = require('@playwright/test');

test.describe('Deal Management Operational Flows', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the dashboard
    await page.goto('/');
  });

  async function clickTab(page, tabName) {
    const isMobile = await page.evaluate(() => window.innerWidth < 640);
    if (isMobile) {
      await page.click('#mobile-menu-btn', { force: true }).catch(() => {});
    }
    await page.click(`a[data-tab="${tabName}"]`, { force: true });
  }

  test('should create a new deal and display it in pipeline', async ({ page }) => {
    await clickTab(page, 'pipeline');
    await page.click('button:has-text("New Deal")', { force: true });
    
    const modal = page.locator('#new-deal-modal');
    await expect(modal).not.toHaveClass(/hidden/);
    await page.fill('#deal-title', 'PT QA Test Auto');
    await page.fill('#deal-amount', '150000000');
    await page.selectOption('#deal-source', 'referral');
    await page.selectOption('#deal-stage', 'new-lead');
    await page.click('button:has-text("Create Lead")', { force: true });
    await expect(modal).toHaveClass(/hidden/);

    const dealCard = page.locator('.tilt-card, .interactive-tilt-card').filter({ hasText: 'PT QA Test Auto' }).first();
    await expect(dealCard).toBeVisible();
    await expect(dealCard).toContainText('Rp 150M');
  });

  test('should edit an existing deal and update dashboard metrics', async ({ page }) => {
    await clickTab(page, 'pipeline');
    await page.waitForSelector('.interactive-tilt-card', { state: 'attached' });
    await page.evaluate(() => {
      const card = document.querySelector('.interactive-tilt-card');
      if (card) card.click();
    });
    const editModal = page.locator('#edit-deal-modal');
    await expect(editModal).not.toHaveClass(/hidden/);
    await page.fill('#edit-deal-amount', '999000000');
    await page.click('button:has-text("Save Changes")', { force: true });
    await expect(editModal).toHaveClass(/hidden/);

    await clickTab(page, 'dashboard');
    const totalPipeline = page.locator('#stat-total-pipeline');
    await expect(totalPipeline).not.toHaveText('Rp 0');
  });

  test('should archive a deal properly', async ({ page }) => {
    await clickTab(page, 'pipeline');
    const badge = page.locator('#pipeline-count-badge');
    const initialCountStr = await badge.textContent();
    const initialCount = parseInt(initialCountStr || '0', 10);

    await page.waitForSelector('.interactive-tilt-card', { state: 'attached' });
    await page.evaluate(() => {
      const card = document.querySelector('.interactive-tilt-card');
      if (card) card.click();
    });
    
    const editModal = page.locator('#edit-deal-modal');
    await expect(editModal).not.toHaveClass(/hidden/);
    await page.click('button:has-text("Archive")', { force: true });
    await expect(editModal).toHaveClass(/hidden/);

    if (initialCount > 0) {
      await expect(badge).toHaveText((initialCount - 1).toString(), { timeout: 10000 });
    }
  });
});
