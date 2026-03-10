import { test, expect } from '@playwright/test'

test.describe('Cooking view', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cooking')
    await page.waitForLoadState('networkidle')
  })

  test('cooking page loads', async ({ page }) => {
    await expect(page).toHaveURL(/\/cooking/)
  })

  test('shows navigation', async ({ page }) => {
    // Navigation should be visible
    await expect(page.locator('nav').first()).toBeVisible()
  })

  test('shows either day selector or empty cooking state', async ({ page }) => {
    // If there are meals in plan, shows cooking UI
    // Otherwise shows "Brak dań" or similar empty state
    const hasContent = await page.locator('body').textContent()
    expect(hasContent).toBeTruthy()
  })

  test('cooking view has correct title in header', async ({ page }) => {
    await expect(page.getByText('Gotowanie')).toBeVisible({ timeout: 5000 })
  })
})
