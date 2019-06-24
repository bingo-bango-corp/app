import { BingoAction } from 'simsalabim-design'

export const confirmDelivery = {
  title: '✅ Mark as delivered',
  backgroundColor: 'var(--primary)',
  onClick: (vm: any) => {
    vm.$emit('confirmDelivery', vm.jobId)
  }
} as BingoAction