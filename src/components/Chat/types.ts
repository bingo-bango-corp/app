import { Transition } from '@/store/models/job'

export type Message = {
  created_by: string,
  id: string,
  message: string,
  seconds: {
    nanoseconds: number,
    seconds: number,
  }
}

export type Notice = {
  type: 'notice',
  seconds: {
    nanoseconds: number,
    seconds: number,
  },
  event: Transition,
  id: string
}