import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import PermissionInterface from '@/store/models/permissions'
import { writeCurrentTokenToUser } from '@/util/setUpNotifications'

@Module({
  namespaced: true
})
export default class Permissions extends VuexModule {
  data: PermissionInterface = {
    checked: false,
    location: undefined,
    notifications: undefined,
    allRequiredGranted: undefined,
    messageTokenInitialized: false,
  }

  get currentPermissions(): PermissionInterface {
    return this.data
  }

  get allGranted(): boolean | undefined {
    return this.data.allRequiredGranted
  }

  get notificationsInitialized(): boolean {
    return this.data.messageTokenInitialized
  }

  @Mutation
  writePermissions(payload: PermissionInterface) {
    this.data = payload
  }

  @Action({ commit: 'writePermissions' })
  async updatePermissions(): Promise<PermissionInterface> {
    const nav = navigator as any
    const locationPermission = await nav.permissions.query(
      { 
        name: 'geolocation'
      })
    const notificationsPermission = await nav.permissions.query(
      { 
        name: 'notifications'
      })

    const allRequiredGranted = (
      notificationsPermission.state === 'granted' &&
      locationPermission.state === 'granted'
    )

    return {
      ...this.data,
      checked: true,
      allRequiredGranted: allRequiredGranted,
      location: locationPermission.state,
      notifications: notificationsPermission.state,
    }
  }

  @Action({ commit: 'writePermissions' })
  async initializeNotifications(): Promise<PermissionInterface> {
    await writeCurrentTokenToUser()

    return {
      ...this.data,
      messageTokenInitialized: true
    }
  }
}