import { ActionsForState } from './types'

import {
  cancelJob,
  confirmDelivery,
  goToChat
} from './actions'

export const ownerActionsForStates: ActionsForState = {
  unassigned: [
    cancelJob
  ],
  assigned: [
    goToChat,
    cancelJob
  ],
  delivered: [
    confirmDelivery
  ],
  cancelled: null,
  lost: null,
  deliveryConfirmed: null,
}