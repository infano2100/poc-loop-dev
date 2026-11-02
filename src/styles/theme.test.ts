import { appTheme, PRIMARY_COLOR } from './theme'

test('uses the design-system primary color and Poppins', () => {
  expect(PRIMARY_COLOR).toBe('#45A9EA')
  expect(appTheme.token?.colorPrimary).toBe(PRIMARY_COLOR)
  expect(appTheme.token?.fontFamily).toContain('Poppins')
})

test('maps the grey scale onto text tokens', () => {
  expect(appTheme.token?.colorText).toBe('#333333')
  expect(appTheme.token?.colorTextSecondary).toBe('#686868')
  expect(appTheme.token?.colorTextPlaceholder).toBe('#999999')
  expect(appTheme.token?.colorBorder).toBe('#E6E6E6')
})
