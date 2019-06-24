import { State } from '@/store/models/job'
import { BingoAction } from 'simsalabim-design'

import {
  cancelJob,
  confirmDelivery,
  goToChat
} from './actions'

type ActionsForState = {
  [key in State]: BingoAction[] | null
}

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