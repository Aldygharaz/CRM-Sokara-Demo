# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: deal-management.spec.js >> Deal Management Operational Flows >> should create a new deal and display it in pipeline
- Location: tests\deal-management.spec.js:17:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('button:has-text("New Deal")')

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - complementary [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e5]: hub
      - generic [ref=e8]:
        - heading "Sokara CRM" [level=1] [ref=e9]
        - paragraph [ref=e10]: Causal Intelligence
    - navigation [ref=e11]:
      - link "dashboard Dashboard" [ref=e12] [cursor=pointer]:
        - /url: "#dashboard"
        - generic [ref=e13]: dashboard
        - generic [ref=e14]: Dashboard
      - link "account_tree Pipeline Board 8" [active] [ref=e15] [cursor=pointer]:
        - /url: "#pipeline"
        - generic [ref=e16]: account_tree
        - generic [ref=e17]: Pipeline Board
        - generic [ref=e18]: "8"
      - link "query_stats Insights" [ref=e19] [cursor=pointer]:
        - /url: "#insights"
        - generic [ref=e20]: query_stats
        - generic [ref=e21]: Insights
      - link "settings Settings" [ref=e22] [cursor=pointer]:
        - /url: "#settings"
        - generic [ref=e23]: settings
        - generic [ref=e24]: Settings
    - generic [ref=e25]:
      - img "Alex Mercer" [ref=e26]
      - generic [ref=e27]:
        - paragraph [ref=e28]: Alex Mercer
        - paragraph [ref=e29]: VP Sales Operations
  - generic [ref=e30]:
    - banner [ref=e31]:
      - generic [ref=e33]:
        - generic [ref=e34]: search
        - textbox "Search pipeline... (Ctrl+K)" [ref=e35]
      - generic [ref=e36]:
        - generic [ref=e37]:
          - button "IDR" [ref=e38] [cursor=pointer]
          - button "USD" [ref=e39] [cursor=pointer]
        - button "help_outline" [ref=e40] [cursor=pointer]
        - button "dark_mode" [ref=e42] [cursor=pointer]
        - button "add New Lead" [ref=e44] [cursor=pointer]:
          - generic [ref=e45]: add
          - generic [ref=e46]: New Lead
    - generic [ref=e47]:
      - generic [ref=e48]:
        - generic [ref=e49]:
          - heading "Pipeline Board" [level=2] [ref=e50]
          - paragraph [ref=e51]: "Stages: New Lead → Contacted → Proposal → Negotiation → Closed Won"
        - generic [ref=e52]:
          - generic [ref=e53]:
            - button "view_kanban Board" [ref=e54] [cursor=pointer]:
              - generic [ref=e55]: view_kanban
              - text: Board
            - button "table_rows Table" [ref=e56] [cursor=pointer]:
              - generic [ref=e57]: table_rows
              - text: Table
          - button "print Print" [ref=e58] [cursor=pointer]:
            - generic [ref=e59]: print
            - text: Print
          - button "add New Lead" [ref=e60] [cursor=pointer]:
            - generic [ref=e61]: add
            - text: New Lead
      - generic [ref=e62]:
        - generic [ref=e63]:
          - generic [ref=e64]:
            - generic [ref=e65]: New Lead (10%)
            - generic [ref=e67]: "1"
          - generic [ref=e69]:
            - generic [ref=e70]:
              - heading "CV Sinar Baru" [level=4] [ref=e73] [cursor=pointer]
              - generic [ref=e74]: 65% Win
            - generic [ref=e75] [cursor=pointer]:
              - generic [ref=e76]: Amount
              - paragraph [ref=e77]: Rp 20.0M
              - generic [ref=e78]: "EV (10%): Rp 2.0M"
            - generic [ref=e80]:
              - generic [ref=e81]:
                - generic [ref=e82]: person
                - text: Budi Santoso
              - generic [ref=e83]:
                - button "←" [ref=e84] [cursor=pointer]
                - button "→" [ref=e85] [cursor=pointer]
        - generic [ref=e86]:
          - generic [ref=e87]:
            - generic [ref=e88]: Contacted (25%)
            - generic [ref=e90]: "1"
          - generic [ref=e92]:
            - generic [ref=e93]:
              - heading "Fintech Utama" [level=4] [ref=e96] [cursor=pointer]
              - generic [ref=e97]: 75% Win
            - generic [ref=e98] [cursor=pointer]:
              - generic [ref=e99]: Amount
              - paragraph [ref=e100]: Rp 28.0M
              - generic [ref=e101]: "EV (25%): Rp 7.0M"
            - generic [ref=e103]:
              - generic [ref=e104]:
                - generic [ref=e105]: person
                - text: James Wilson
              - generic [ref=e106]:
                - button "←" [ref=e107] [cursor=pointer]
                - button "→" [ref=e108] [cursor=pointer]
        - generic [ref=e109]:
          - generic [ref=e110]:
            - generic [ref=e111]: Proposal (50%)
            - generic [ref=e113]: "2"
          - generic [ref=e114]:
            - generic [ref=e115]:
              - generic [ref=e116]:
                - heading "TechFlow Indonesia" [level=4] [ref=e119] [cursor=pointer]
                - generic [ref=e120]: 85% Win
              - generic [ref=e121] [cursor=pointer]:
                - generic [ref=e122]: Amount
                - paragraph [ref=e123]: Rp 12.5M
                - generic [ref=e124]: "EV (50%): Rp 6.3M"
              - generic [ref=e126]:
                - generic [ref=e127]:
                  - generic [ref=e128]: person
                  - text: Sarah Jenkins
                - generic [ref=e129]:
                  - button "←" [ref=e130] [cursor=pointer]
                  - button "→" [ref=e131] [cursor=pointer]
            - generic [ref=e132]:
              - generic [ref=e133]:
                - heading "IndoRetail Group" [level=4] [ref=e136] [cursor=pointer]
                - generic [ref=e137]: 60% Win
              - generic [ref=e138] [cursor=pointer]:
                - generic [ref=e139]: Amount
                - paragraph [ref=e140]: Rp 32.0M
                - generic [ref=e141]: "EV (50%): Rp 16.0M"
              - generic [ref=e143]:
                - generic [ref=e144]:
                  - generic [ref=e145]: person
                  - text: Budi Santoso
                - generic [ref=e146]:
                  - button "←" [ref=e147] [cursor=pointer]
                  - button "→" [ref=e148] [cursor=pointer]
        - generic [ref=e149]:
          - generic [ref=e150]:
            - generic [ref=e151]: Negotiation (75%)
            - generic [ref=e153]: "2"
          - generic [ref=e154]:
            - generic [ref=e155]:
              - generic [ref=e156]:
                - heading "PT Maju Bersama" [level=4] [ref=e159] [cursor=pointer]
                - generic [ref=e160]: 80% Win
              - generic [ref=e161] [cursor=pointer]:
                - generic [ref=e162]: Amount
                - paragraph [ref=e163]: Rp 45.0M
                - generic [ref=e164]: "EV (75%): Rp 33.8M"
              - generic [ref=e166]:
                - generic [ref=e167]:
                  - generic [ref=e168]: person
                  - text: Alex Mercer
                - generic [ref=e169]:
                  - button "←" [ref=e170] [cursor=pointer]
                  - button "→" [ref=e171] [cursor=pointer]
            - generic [ref=e172]:
              - generic [ref=e173]:
                - heading "Nusa Infrastruktur" [level=4] [ref=e176] [cursor=pointer]
                - generic [ref=e177]: 95% Win
              - generic [ref=e178] [cursor=pointer]:
                - generic [ref=e179]: Amount
                - paragraph [ref=e180]: Rp 65.0M
                - generic [ref=e181]: "EV (75%): Rp 48.8M"
              - generic [ref=e183]:
                - generic [ref=e184]:
                  - generic [ref=e185]: person
                  - text: Sarah Jenkins
                - generic [ref=e186]:
                  - button "←" [ref=e187] [cursor=pointer]
                  - button "→" [ref=e188] [cursor=pointer]
        - generic [ref=e189]:
          - generic [ref=e190]:
            - generic [ref=e191]: Closed Won (100%)
            - generic [ref=e193]: "2"
          - generic [ref=e194]:
            - generic [ref=e195]:
              - generic [ref=e196]:
                - heading "Bank Mega Syariah" [level=4] [ref=e199] [cursor=pointer]
                - generic [ref=e200]: 100% Win
              - generic [ref=e201] [cursor=pointer]:
                - generic [ref=e202]: Amount
                - paragraph [ref=e203]: Rp 150.0M
                - generic [ref=e204]: "EV (100%): Rp 150.0M"
              - generic [ref=e206]:
                - generic [ref=e207]:
                  - generic [ref=e208]: person
                  - text: Alex Mercer
                - generic [ref=e209]:
                  - button "←" [ref=e210] [cursor=pointer]
                  - button "→" [ref=e211] [cursor=pointer]
            - generic [ref=e212]:
              - generic [ref=e213]:
                - heading "Astra Digital Cloud" [level=4] [ref=e216] [cursor=pointer]
                - generic [ref=e217]: 100% Win
              - generic [ref=e218] [cursor=pointer]:
                - generic [ref=e219]: Amount
                - paragraph [ref=e220]: Rp 120.0M
                - generic [ref=e221]: "EV (100%): Rp 120.0M"
              - generic [ref=e223]:
                - generic [ref=e224]:
                  - generic [ref=e225]: person
                  - text: Alex Mercer
                - generic [ref=e226]:
                  - button "←" [ref=e227] [cursor=pointer]
                  - button "→" [ref=e228] [cursor=pointer]
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
> 19 |     await page.click('button:has-text("New Deal")', { force: true });
     |                ^ Error: page.click: Test timeout of 30000ms exceeded.
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
  66 |     await expect(editModal).not.toHaveClass(/hidden/);
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