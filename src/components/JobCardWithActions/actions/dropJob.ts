import { BingoAction } from 'simsalabim-design'
import { dropJob } from '@/helpers/jobs'

export const dropJobAction = {
  title: '🚫 Can\'t pick it up',
  backgroundColor: '#EB5757',
  onClick: async (vm: any) => {
    await dropJob(vm.$store.getters.uid, vm.$store.state.currentJob.data.id)
  }
} as BingoAction