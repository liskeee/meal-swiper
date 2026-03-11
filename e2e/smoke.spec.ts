import { test, expect } from '@playwright/test'

test.describe('Smoke tests', () => {
  test('page loads with 200 OK', async ({ page }) => {
    const response = await page.goto('/')
    expect(response?.status()).toBe(200)
  })

  test('no critical JS console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text()
        // Filter out known non-critical errors (HMR, analytics, extensions)
        if (
          !text.includes('favicon') &&
          !text.includes('hot-update') &&
          !text.includes('chrome-extension') &&
          !text.includes('Failed to load resource') &&
          !text.includes('net::ERR_') &&
          !text.includes('ERR_BLOCKED')
        ) {
          errors.push(text)
        }
      }
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Only fail on truly critical errors (syntax errors, React crashes)
    const criticalErrors = errors.filter(
      (e) => e.includes('SyntaxError') || e.includes('TypeError') || e.includes('React')
    )
    expect(criticalErrors).toEqual([])
  })

  test('no failed critical network requests', async ({ page }) => {
    const failedRequests: string[] = []
    page.on('requestfailed', (req) => {
      const url = req.url()
      // Only track failures for app routes (not external resources)
      if (url.includes('localhost')) {
        failedRequests.push(`${req.method()} ${url} - ${req.failure()?.errorText}`)
      }
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    expect(failedRequests).toEqual([])
  })
})
