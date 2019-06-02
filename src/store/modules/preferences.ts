import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { preferences } from '@/store/models/preferences'

@Module
export default class Profile extends VuexModule {
  data: preferences = {
    theme: 'light'
  }

  get currentTheme() {
    return this.data.theme
  }

  @Mutation
  writeCurrentTheme(theme: string) {
    this.data.theme = theme
  }

  @Action({ commit: 'writeCurrentTheme' })
  setCurrentTheme(theme: string) {
    return theme
  }
}