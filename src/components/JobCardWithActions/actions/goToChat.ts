import { BingoAction } from 'simsalabim-design'
import router from '@/router'

export const goToChat = {
  title: '💬 Go to chat',
  backgroundColor: 'var(--secondary)',
  onClick: (vm: any) => {
    router.push(`/get-things/${vm.jobId}`)
  }
} as BingoAction