import { BingoAction } from 'simsalabim-design'
import { confirmDelivery } from '@/helpers/jobs'

export const confirmDeliveryAction = {
  title: '✅ Confirm delivery',
  backgroundColor: 'var(--primary)',
  onClick: async (vm: any) => {
   await confirmDelivery(vm.jobId, vm.$store.getters.uid)
  }
} as BingoAction