import { BingoAction } from 'simsalabim-design'
import { takeJob } from '@/helpers/jobs'

export const assignJob = {
  title: '🤚 Pick this up',
  backgroundColor: 'var(--primary)',
  onClick: async (vm: any) => {
    await takeJob(vm.jobId, vm.$store.getters.uid)
    vm.$router.push('/make-money/current-job')
  }
} as BingoAction