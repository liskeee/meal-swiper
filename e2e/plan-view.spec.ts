import { test, expect } from '@playwright/test'

test.describe('Plan view - weekly calendar', () => {
  test('shows all 5 week days', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Should show Mon-Fri
    await expect(page.getByText('Poniedziałek')).toBeVisible()
    await expect(page.getByText('Piątek')).toBeVisible()
  })

  test('navigate to next week and back', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Get current week range text
    const headerText = page.locator('header').locator('text=/\\d+/')
    const initialText = await headerText.first().textContent()

    // Click next week button
    await page.locator('button:has(.material-symbols-outlined:text("chevron_right"))').click()
    await page.waitForTimeout(300)

    // Text should change
    const newText = await headerText.first().textContent()
    expect(newText).not.toBe(initialText)

    // Go back
    await page.locator('button:has(.material-symbols-outlined:text("chevron_left"))').click()
    await page.waitForTimeout(300)

    const backText = await headerText.first().textContent()
    expect(backText).toBe(initialText)
  })

  test('empty day shows "Brak planu"', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText('Brak planu').first()).toBeVisible()
  })

  test('settings link is visible in header', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const settingsLink = page.locator('a[href="/settings"]')
    await expect(settingsLink).toBeVisible()
  })

  test('navigates to swipe view from nav', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Click on "Propozycje" nav item
    await page.getByText('Propozycje').click()
    await page.waitForLoadState('networkidle')

    // Should show swipe interface
    await expect(page).toHaveURL(/\/swipe/)
  })
})
