import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { preferences } from '@/store/models/preferences'
import { themes, theme } from 'simsalabim-design'
import { setThemeColorForTheme } from '@/util/setThemeColor'

@Module
export default class Preferences extends VuexModule {
  data: preferences = {
    theme: 'light'
  }

  get currentTheme(): string {
    return this.data.theme
  }

  get currentThemeObject(): theme {
    return themes[this.data.theme]
  }

  @Mutation
  writeCurrentTheme(theme: string) {
    this.data.theme = theme
    setThemeColorForTheme(themes[theme])
  }

  @Action({ commit: 'writeCurrentTheme' })
  setCurrentTheme(theme: string) {
    return theme
  }
}