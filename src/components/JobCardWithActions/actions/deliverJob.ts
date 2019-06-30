import { BingoAction } from 'simsalabim-design'
import { deliverJob } from '@/helpers/jobs'

export const deliverJobAction = {
  title: '✅ Mark as delivered',
  backgroundColor: 'var(--primary)',
  onClick: async (vm: any) => {
    await deliverJob(vm.jobId, vm.$store.getters.uid)
  }
} as BingoAction