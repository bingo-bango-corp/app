import { State } from '@/store/models/job'
import { BingoAction } from 'simsalabim-design'

type ActionsForState = {
  [key in State]: BingoAction[] | null
}

const cancelJobAction: BingoAction = {
  title: '🚫 Cancel job',
  backgroundColor: '#EB5757',
  onClick: (vm: any) => {
    vm.$emit('cancelJob', vm.jobId)
  }
}

const goToChatAction: BingoAction = {
  title: '💬 Go to chat',
  backgroundColor: 'var(--secondary)',
  onClick: (vm: any) => {
    vm.$emit('goToChat', vm.jobId)
  }
}

export const actionsForStates: ActionsForState = {
  unassigned: [
    cancelJobAction
  ],
  assigned: [
    goToChatAction,
    cancelJobAction
  ],
  delivered: null,
  cancelled: null,
  lost: null,
  deliveryConfirmed: null,
}