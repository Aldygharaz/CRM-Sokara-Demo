# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: deal-management.spec.js >> Deal Management Operational Flows >> should archive a deal properly
- Location: tests\deal-management.spec.js:53:3

# Error details

```
Error: expect(locator).not.toHaveClass(expected) failed

Locator: locator('#edit-deal-modal')
Expected pattern: not /hidden/
Received string: "fixed inset-0 bg-black/40 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4"
Timeout: 5000ms

Call log:
  - Expect "not toHaveClass" with timeout 5000ms
  - waiting for locator('#edit-deal-modal')
    13 × locator resolved to <div id="edit-deal-modal" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">…</div>
       - unexpected value "fixed inset-0 bg-black/40 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4"

```

```yaml
- complementary:
  - text: hub
  - heading "Sokara CRM" [level=1]
  - paragraph: Causal Intelligence
  - navigation:
    - link "dashboard Dashboard":
      - /url: "#dashboard"
    - link "account_tree Pipeline Board 8":
      - /url: "#pipeline"
    - link "query_stats Insights":
      - /url: "#insights"
    - link "settings Settings":
      - /url: "#settings"
  - img "Alex Mercer"
  - paragraph: Alex Mercer
  - paragraph: VP Sales Operations
- banner:
  - text: search
  - textbox "Search pipeline... (Ctrl+K)"
  - button "IDR"
  - button "USD"
  - button "help_outline"
  - button "dark_mode"
  - button "add New Lead"
- heading "Pipeline Board" [level=2]
- paragraph: "Stages: New Lead → Contacted → Proposal → Negotiation → Closed Won"
- button "view_kanban Board"
- button "table_rows Table"
- button "print Print"
- button "add New Lead"
- text: New Lead (10%) 1
- heading "CV Sinar Baru" [level=4]
- text: 65% Win Amount
- paragraph: Rp 20.0M
- text: "EV (10%): Rp 2.0M person Budi Santoso"
- button "←"
- button "→"
- text: Contacted (25%) 1
- heading "Fintech Utama" [level=4]
- text: 75% Win Amount
- paragraph: Rp 28.0M
- text: "EV (25%): Rp 7.0M person James Wilson"
- button "←"
- button "→"
- text: Proposal (50%) 2
- heading "TechFlow Indonesia" [level=4]
- text: 85% Win Amount
- paragraph: Rp 12.5M
- text: "EV (50%): Rp 6.3M person Sarah Jenkins"
- button "←"
- button "→"
- heading "IndoRetail Group" [level=4]
- text: 60% Win Amount
- paragraph: Rp 32.0M
- text: "EV (50%): Rp 16.0M person Budi Santoso"
- button "←"
- button "→"
- text: Negotiation (75%) 2
- heading "PT Maju Bersama" [level=4]
- text: 80% Win Amount
- paragraph: Rp 45.0M
- text: "EV (75%): Rp 33.8M person Alex Mercer"
- button "←"
- button "→"
- heading "Nusa Infrastruktur" [level=4]
- text: 95% Win Amount
- paragraph: Rp 65.0M
- text: "EV (75%): Rp 48.8M person Sarah Jenkins"
- button "←"
- button "→"
- text: Closed Won (100%) 2
- heading "Bank Mega Syariah" [level=4]
- text: 100% Win Amount
- paragraph: Rp 150.0M
- text: "EV (100%): Rp 150.0M person Alex Mercer"
- button "←"
- button "→"
- heading "Astra Digital Cloud" [level=4]
- text: 100% Win Amount
- paragraph: Rp 120.0M
- text: "EV (100%): Rp 120.0M person Alex Mercer"
- button "←"
- button "→"
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('Deal Management Operational Flows', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     // Navigate to the dashboard
  6  |     await page.goto('/');
  7  |   });
  8  | 
  9  |   async function clickTab(page, tabName) {
  10 |     const isMobile = await page.evaluate(() => window.innerWidth < 640);
  11 |     if (isMobile) {
  12 |       await page.click('#mobile-menu-btn', { force: true }).catch(() => {});
  13 |     }
  14 |     await page.click(`a[data-tab="${tabName}"]`, { force: true });
  15 |   }
  16 | 
  17 |   test('should create a new deal and display it in pipeline', async ({ page }) => {
  18 |     await clickTab(page, 'pipeline');
  19 |     await page.click('button:has-text("New Deal")', { force: true });
  20 |     
  21 |     const modal = page.locator('#new-deal-modal');
  22 |     await expect(modal).not.toHaveClass(/hidden/);
  23 |     await page.fill('#deal-title', 'PT QA Test Auto');
  24 |     await page.fill('#deal-amount', '150000000');
  25 |     await page.selectOption('#deal-source', 'referral');
  26 |     await page.selectOption('#deal-stage', 'new-lead');
  27 |     await page.click('button:has-text("Create Lead")', { force: true });
  28 |     await expect(modal).toHaveClass(/hidden/);
  29 | 
  30 |     const dealCard = page.locator('.tilt-card, .interactive-tilt-card').filter({ hasText: 'PT QA Test Auto' }).first();
  31 |     await expect(dealCard).toBeVisible();
  32 |     await expect(dealCard).toContainText('Rp 150M');
  33 |   });
  34 | 
  35 |   test('should edit an existing deal and update dashboard metrics', async ({ page }) => {
  36 |     await clickTab(page, 'pipeline');
  37 |     await page.waitForSelector('.interactive-tilt-card', { state: 'attached' });
  38 |     await page.evaluate(() => {
  39 |       const card = document.querySelector('.interactive-tilt-card');
  40 |       if (card) card.click();
  41 |     });
  42 |     const editModal = page.locator('#edit-deal-modal');
  43 |     await expect(editModal).not.toHaveClass(/hidden/);
  44 |     await page.fill('#edit-deal-amount', '999000000');
  45 |     await page.click('button:has-text("Save Changes")', { force: true });
  46 |     await expect(editModal).toHaveClass(/hidden/);
  47 | 
  48 |     await clickTab(page, 'dashboard');
  49 |     const totalPipeline = page.locator('#stat-total-pipeline');
  50 |     await expect(totalPipeline).not.toHaveText('Rp 0');
  51 |   });
  52 | 
  53 |   test('should archive a deal properly', async ({ page }) => {
  54 |     await clickTab(page, 'pipeline');
  55 |     const badge = page.locator('#pipeline-count-badge');
  56 |     const initialCountStr = await badge.textContent();
  57 |     const initialCount = parseInt(initialCountStr || '0', 10);
  58 | 
  59 |     await page.waitForSelector('.interactive-tilt-card', { state: 'attached' });
  60 |     await page.evaluate(() => {
  61 |       const card = document.querySelector('.interactive-tilt-card');
  62 |       if (card) card.click();
  63 |     });
  64 |     
  65 |     const editModal = page.locator('#edit-deal-modal');
> 66 |     await expect(editModal).not.toHaveClass(/hidden/);
     |                                 ^ Error: expect(locator).not.toHaveClass(expected) failed
  67 |     await page.click('button:has-text("Archive")', { force: true });
  68 |     await expect(editModal).toHaveClass(/hidden/);
  69 | 
  70 |     if (initialCount > 0) {
  71 |       await expect(badge).toHaveText((initialCount - 1).toString(), { timeout: 10000 });
  72 |     }
  73 |   });
  74 | });
  75 | 
```