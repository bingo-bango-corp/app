import { BingoAction } from 'simsalabim-design'

export const goToChat = {
  title: '💬 Go to chat',
  backgroundColor: 'var(--secondary)',
  onClick: (vm: any) => {
    vm.$emit('goToChat', vm.jobId)
  }
} as BingoAction