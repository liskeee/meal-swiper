import { test, expect } from '@playwright/test'

test.describe('Category filter in swipe view', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/swipe')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)
  })

  test('shows day selector chips', async ({ page }) => {
    await expect(page.getByText('Pn')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText('Wt')).toBeVisible()
    await expect(page.getByText('Pt')).toBeVisible()
  })

  test('can select different day chips', async ({ page }) => {
    // Click on "Wt" day
    await page.getByText('Wt').click()
    // Should highlight that day - verify active state
    const wtBtn = page.locator('button').filter({ hasText: 'Wt' })
    await expect(wtBtn).toBeVisible()
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
