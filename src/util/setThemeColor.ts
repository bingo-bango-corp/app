import { theme } from 'simsalabim-design'

export const setThemeColor = (color: string) => {
  document.querySelector('#theme-color')!.setAttribute('content', color)
}

export const setThemeColorForTheme = (theme: theme) => {
  const tc = theme.tokens.background
  setThemeColor(`rgb(${tc.r},${tc.g},${tc.b})`)
}