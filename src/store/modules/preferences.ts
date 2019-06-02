import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { preferences } from '@/store/models/preferences'

@Module
export default class Profile extends VuexModule {
  theme = 'light'

  get currentTheme() {
    return this.theme
  }

  @Mutation
  writeCurrentTheme(theme: string) {
    this.theme = theme
  }

  @Action({ commit: 'writeCurrentTheme' })
  setCurrentTheme(theme: string) {
    return theme
  }
}