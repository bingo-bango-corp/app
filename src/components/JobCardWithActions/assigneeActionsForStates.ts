import { ActionsForState } from './types'
import { dropJob, deliverJob, assignJob } from './actions'

export const assigneeActionsForStates: ActionsForState = {
  unassigned: [
    assignJob
  ],
  assigned: [
    deliverJob,
    dropJob
  ],
  delivered: null,
  cancelled: null,
  lost: null,
  deliveryConfirmed: null,
}