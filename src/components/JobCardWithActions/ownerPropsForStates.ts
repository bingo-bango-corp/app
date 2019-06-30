import firebase from 'firebase/app'
import 'firebase/firestore'

import i18n from '@/i18n'

import { State, Job, STATE_CONSTANTS } from '@/store/models/job'
import { PublicProfile } from '@/store/models/profile'

import { JobCardProps } from './types'

// translation base path
const tb = 'jobCard.owner'

export default async (state: State, vm: any): Promise<JobCardProps> => {
  switch (state) {
    case STATE_CONSTANTS.UNASSIGNED:
      return {
        elevated: true,
        description: vm.description
      }
    case STATE_CONSTANTS.ASSIGNED:
      var assignee = await getProfileOfAssignee(vm.job)

      return {
        elevated: true,
        personNote: {
          pictureUrl: new URL(assignee.photoURL!),
          text: i18n.tc(`${tb}.assigned`, 0, {
            user: assignee.displayName
          })
        }
      }
    case STATE_CONSTANTS.CANCELLED:
      return {
        elevated: false,
        personNote: {
          text: i18n.tc(`${tb}.cancelled`)
        }
      }
    case STATE_CONSTANTS.LOST:
      var assignee = await getProfileOfAssignee(vm.job)
      
      return {
        elevated: false,
        personNote: {
          pictureUrl: new URL(assignee.photoURL!),
          text: i18n.tc(`${tb}.lost`, 0, {
            user: assignee.displayName
          })
        }
      }
    case STATE_CONSTANTS.DELIVERED:
      var assignee = await getProfileOfAssignee(vm.job) 

      return {
        elevated: true,
        personNote: {
          pictureUrl: new URL(assignee.photoURL!),
          text: i18n.tc(`${tb}.delivered`, 0, {
            user: assignee.displayName
          })
        }
      }
    case STATE_CONSTANTS.DELIVERY_CONFIRMED:
      var assignee = await getProfileOfAssignee(vm.job) 

      return {
        elevated: false,
        personNote: {
          pictureUrl: new URL(assignee.photoURL!),
          text: i18n.tc(`${tb}.delivery_confirmed`, 0, {
            user: assignee.displayName
          })
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