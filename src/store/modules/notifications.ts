import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { writeCurrentTokenToUser } from '@/util/setUpNotifications'

interface notificationInterface {
  messageTokenInitialized: boolean
  currentViewValidator(): boolean
}

@Module({
  namespaced: true
})
export default class Notifications extends VuexModule {
  data: notificationInterface = {
    messageTokenInitialized: false,
    currentViewValidator: () => true
  }

  get notificationsInitialized(): boolean {
    return this.data.messageTokenInitialized
  }

  get currentViewValidator(): Function {
    return this.data.currentViewValidator || (() => {})
  }

  @Mutation
  setMessageTokenInitialized(payload: boolean) {
    this.data.messageTokenInitialized = payload
  }

  @Mutation
  writeCurrentViewValidator(payload: () => boolean ) {
    this.data.currentViewValidator = payload
  }

  @Action({ commit: 'setMessageTokenInitialized' })
  async initializeNotifications(): Promise<boolean> {
    return await writeCurrentTokenToUser()
  }

  @Action({ commit: 'writeCurrentViewValidator' })
  setCurrentViewValidator(payload: Function): Function {
    return payload
  }

  @Action({ commit: 'writeCurrentViewValidator' })
  purgeCurrentViewValidator(): () => boolean {
    return () => true
  }
}