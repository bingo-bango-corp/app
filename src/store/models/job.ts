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
  },
  terminal: boolean
}

export const STATE_CONSTANTS = {
  UNASSIGNED: 'unassigned',
  ASSIGNED: 'assigned',
  DELIVERED: 'delivered',
  DELIVERY_CONFIRMED: 'deliveryConfirmed',
  CANCELLED: 'cancelled',
  LOST: 'lost'
}

// All states that may transition to another.
export const OPEN_STATES = [
  STATE_CONSTANTS.UNASSIGNED,
  STATE_CONSTANTS.ASSIGNED,
  STATE_CONSTANTS.DELIVERED,
]

// Terminal states that will never change to something else.
export const SETTLED_STATES = [
  STATE_CONSTANTS.DELIVERY_CONFIRMED,
  STATE_CONSTANTS.CANCELLED,
  STATE_CONSTANTS.LOST,
]

export type OpenState =
  'unassigned' |
  'assigned' |
  'delivered'

export type SettledState =
  'deliveryConfirmed' |
  'cancelled' |
  'lost'

export type State = OpenState | SettledState

// transition identifiers between states
export const STATE_TRANSITION_CONSTANTS = {
  ASSIGN: 'assign',
  DROP: 'drop',
  CANCEL: 'cancel',
  DELIVER: 'deliver',
  CONFIRM_DELIVERY: 'confirm_delivery',
}

export const OWNER_TRANSITIONS = [
  STATE_TRANSITION_CONSTANTS.CANCEL,
  STATE_TRANSITION_CONSTANTS.CONFIRM_DELIVERY,
]

export const ASSIGNEE_TRANSITIONS = [
  STATE_TRANSITION_CONSTANTS.DELIVER,
  STATE_TRANSITION_CONSTANTS.ASSIGN,
  STATE_TRANSITION_CONSTANTS.DROP
]

export type OwnerTransitions =
  'cancel' |
  'confirm_delivery'

export type AssigneeTransitions =
  'deliver' |
  'assign' |
  'drop'

export type Transition = OwnerTransitions | AssigneeTransitions

// Describe relationship between a user and a job
export const USER_JOB_RELATIONSHIPS = {
  OWNER: 'owner',
  ASSIGNEE: 'assignee'
}

export type JobRelationship = 'owner' | 'assignee'
