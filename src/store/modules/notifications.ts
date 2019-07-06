import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { writeCurrentTokenToUser } from '@/util/setUpNotifications'

interface notificationInterface {
  messageTokenInitialized: boolean
}

@Module({
  namespaced: true
})
export default class Notifications extends VuexModule {
  data: notificationInterface = {
    messageTokenInitialized: false
  }

  get notificationsInitialized(): boolean {
    return this.data.messageTokenInitialized
  }

  @Mutation
  setMessageTokenInitialized(payload: boolean) {
    this.data.messageTokenInitialized = payload
  }

  @Action({ commit: 'setMessageTokenInitialized' })
  async initializeNotifications(): Promise<boolean> {
    return await writeCurrentTokenToUser()
  }
}