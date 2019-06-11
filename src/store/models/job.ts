import { PublicProfileRef } from '@/store/models/profile'
import { GeoPoint } from '@firebase/firestore-types'

export type Job = {
  state: 'assigned' | 'delivered' | 'cancelled'
  assignee: PublicProfileRef
  owner: PublicProfileRef
  description: string
  id?: string
  point: {
    geohash: string
    geopoint: GeoPoint
  }
  thing: string
  timestamp: any
  tip: {
    cents: number
    currency: string
  }
} | {
  state: 'unassigned' | 'cancelled'
  owner: PublicProfileRef
  description: string
  id?: string
  point: {
    geohash: string
    geopoint: GeoPoint
  }
  thing: string
  timestamp: any
  tip: {
    cents: number
    currency: string
  }
}