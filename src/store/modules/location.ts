import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { LocationType } from '@/store/models/location'

@Module
export default class Location extends VuexModule {
  data: LocationType = {
    permission: false,
    loading: false
  }

  get currentLocation(): [number, number] | null {
    if (this.data.permission)
      return this.data.location
    else
      console.warn('No location available')
      return null
  }

  get loading(): boolean {
    return this.data.loading
  }

  @Mutation
  writeLocationData(data: LocationType) {
    this.data = data
  }

  @Action({ commit: 'writeLocationData' })
  async updateLocation(): Promise<LocationType> {
    this.data.loading = true
    const request = await geolocationRequest().catch((e) => {
      return {
        permission: false
      }
    })
    return {
      permission: true,
      loading: false,
      location: [
        request.coords.latitude,
        request.coords.longitude
      ],
      accuracy: request.coords.accuracy,
    }
  }
}

const geolocationRequest = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(function (position) {
      resolve(position)
    })
  })
}