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
      var assignee = await getProfileOfAssignee(vm.job) 

      return {
        elevated: true,
        personNote: {
          pictureUrl: new URL(assignee.photoURL!),
          text: `${assignee.displayName} marked this as delivered`
        }
      }
    default:
      return {
        elevated: false
      }
  }
}

const getProfileOfAssignee = async (job: Job) => {
  const db = firebase.firestore()

  if (!job.assignee) throw new Error('No assignee on this job.')

  return (await db
    .collection('users')
    .doc(job.assignee.uid)
    .get()).data() as PublicProfile
} 