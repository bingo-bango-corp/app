import { BingoAction } from 'simsalabim-design'
import { cancelJob } from '@/helpers/jobs'

export const cancelJobAction = {
  title: '🚫 Cancel job',
  backgroundColor: '#EB5757',
  onClick: async (vm: any) => {
    await cancelJob(vm.jobId, vm.$store.getters.uid)
  }
} as BingoAction