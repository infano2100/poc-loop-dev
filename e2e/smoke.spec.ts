import { test, expect } from '@playwright/test'

const viewports = [
  { name: '1440', width: 1440, height: 900 },
  { name: '768', width: 768, height: 1024 },
]

for (const vp of viewports) {
  test(`app loads at ${vp.name}px`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height })
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await page.screenshot({ path: `e2e-screenshots/smoke-${vp.name}.png`, fullPage: true })
  })
}
