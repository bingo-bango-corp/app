import { PublicProfileRef } from '@/store/models/profile'
import { GeoPoint } from '@firebase/firestore-types'

export type Job = {
  state: State
  assignee?: PublicProfileRef
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

export const STATE_CONSTANTS = {
  UNASSIGNED: 'unassigned',
  ASSIGNED: 'assigned',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  LOST: 'lost'
}

// All states that may transition to another.
export const OPEN_STATES = [
  STATE_CONSTANTS.UNASSIGNED,
  STATE_CONSTANTS.ASSIGNED,
]

// Terminal states that will never change to something else.
export const SETTLED_STATES = [
  STATE_CONSTANTS.DELIVERED,
  STATE_CONSTANTS.CANCELLED,
  STATE_CONSTANTS.LOST,
]

export type OpenState =
  'unassigned' |
  'assigned'

export type SettledState =
  'delivered' |
  'cancelled' |
  'lost'

export type State = OpenState | SettledState
