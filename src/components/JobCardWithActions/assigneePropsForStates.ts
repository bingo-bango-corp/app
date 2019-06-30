import firebase from 'firebase/app'
import 'firebase/firestore'

import { State, Job, STATE_CONSTANTS } from '@/store/models/job'
import { PublicProfile } from '@/store/models/profile'

import { JobCardProps } from './types'

export default async (state: State, vm: any): Promise<JobCardProps> => {
  switch (state) {
    case STATE_CONSTANTS.ASSIGNED:
      return {
        elevated: true,
        description: vm.description
      }
    case STATE_CONSTANTS.LOST:
      return {
        elevated: false,
        personNote: {
          text: `You said you can't pick this up.`
        }
      }
    case STATE_CONSTANTS.DELIVERED:
      var owner = await getProfileOfOwner(vm.job)

      return {
        elevated: true,
        personNote: {
          pictureUrl: new URL(owner.photoURL!),
          text: `Waiting for ${owner.displayName} to confirm delivery…`
        }
      }
    default:
      return {
        elevated: false
      }
  }
}

const getProfileOfOwner = async (job: Job) => {
  const db = firebase.firestore()

  return (await db
    .collection('users')
    .doc(job.owner.uid)
    .get()).data() as PublicProfile
} 