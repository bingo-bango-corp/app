import { ActionsForState } from './types'
import { dropJob, deliverJob } from './actions'

export const assigneeActionsForStates: ActionsForState = {
  unassigned: null,
  assigned: [
    deliverJob,
    dropJob
  ],
  delivered: null,
  cancelled: null,
  lost: null,
  deliveryConfirmed: null,
}