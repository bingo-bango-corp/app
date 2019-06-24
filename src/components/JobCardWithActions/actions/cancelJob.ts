import { BingoAction } from 'simsalabim-design'

export const cancelJob = {
  title: '🚫 Cancel job',
  backgroundColor: '#EB5757',
  onClick: (vm: any) => {
    vm.$emit('cancelJob', vm.jobId)
  }
} as BingoAction