import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import PermissionInterface from '@/store/models/permissions'

@Module({
  namespaced: true
})
export default class Permissions extends VuexModule {
  data: PermissionInterface = {
    checked: false,
    location: undefined,
    notifications: undefined,
    allRequiredGranted: undefined
  }

  get currentPermissions(): PermissionInterface {
    return this.data
  }

  get allGranted(): boolean | undefined {
    return this.data.allRequiredGranted
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
      checked: true,
      allRequiredGranted: allRequiredGranted,
      location: locationPermission.state,
      notifications: notificationsPermission.state,
    }
  }
}