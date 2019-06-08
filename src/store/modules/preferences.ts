import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { preferences } from '@/store/models/preferences'
import { themes } from 'simsalabim-design'
import setThemeColor from '@/util/setThemeColor'

@Module
export default class Preferences extends VuexModule {
  data: preferences = {
    theme: 'light'
  }

  get currentTheme() {
    return this.data.theme
  }

  @Mutation
  writeCurrentTheme(theme: string) {
    this.data.theme = theme
    const tc = themes[theme].tokens.background
    setThemeColor(`rgb(${tc.r},${tc.g},${tc.b})`)
  }

  @Action({ commit: 'writeCurrentTheme' })
  setCurrentTheme(theme: string) {
    return theme
  }
}