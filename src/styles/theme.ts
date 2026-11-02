import type { ThemeConfig } from 'antd'

export const PRIMARY_COLOR = '#45A9EA'

export const appTheme: ThemeConfig = {
  token: {
    colorPrimary: PRIMARY_COLOR,
    colorText: '#333333',
    colorTextSecondary: '#686868',
    colorTextPlaceholder: '#999999',
    colorBorder: '#E6E6E6',
    colorBgLayout: '#F4F5F5',
    colorBgContainer: '#FFFFFF',
    fontFamily: "'Poppins', system-ui, sans-serif",
    fontSize: 16,
    borderRadius: 4,
  },
  components: {
    Input: { colorBgContainer: '#F5F5F5', controlHeight: 50 },
    Button: { controlHeight: 50 },
  },
}
