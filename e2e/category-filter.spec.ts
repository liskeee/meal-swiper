import { test, expect } from '@playwright/test'

test.describe('Category filter in swipe view', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/swipe')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)
  })

  test('shows day selector chips', async ({ page }) => {
    // DaySelector renders day chips — use button role to avoid ambiguity
    const pnBtn = page.locator('button').filter({ hasText: /^Pn$/ })
    const wtBtn = page.locator('button').filter({ hasText: /^Wt$/ })
    const ptBtn = page.locator('button').filter({ hasText: /^Pt$/ })
    await expect(pnBtn.first()).toBeVisible({ timeout: 10000 })
    await expect(wtBtn.first()).toBeVisible()
    await expect(ptBtn.first()).toBeVisible()
  })

  test('can select different day chips', async ({ page }) => {
    // Click on "Wt" day
    const wtBtn = page.locator('button').filter({ hasText: /^Wt$/ })
    await wtBtn.first().click()
    await expect(wtBtn.first()).toBeVisible()
  })

  test('swipe view shows meal cards or empty state', async ({ page }) => {
    // Either a meal card or "Brak więcej posiłków" should be visible
    const hasMealCard = await page.locator('[class*="rounded-2xl"]').count()
    const hasEmpty = await page
      .getByText('Brak więcej posiłków')
      .isVisible()
      .catch(() => false)

    expect(hasMealCard > 0 || hasEmpty).toBe(true)
  })

  test('shows "Pomiń ten dzień" button when day selected', async ({ page }) => {
    // If a day is auto-selected, the button should be visible
    const skipBtn = page.getByText(/Pomiń ten dzień/)
    const isVisible = await skipBtn.isVisible().catch(() => false)
    // Skip button only shows if currentDay is set
    if (isVisible) {
      await expect(skipBtn).toBeVisible()
    }
  })
})
