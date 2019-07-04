import firebase from 'firebase/app'
import 'firebase/firestore'

import i18n from '@/i18n'

import { State, Job, STATE_CONSTANTS } from '@/store/models/job'
import { PublicProfile } from '@/store/models/profile'

import { JobCardProps } from './types'

// translation base path
const tb = 'jobCard.assignee'

export default async (state: State, vm: any): Promise<JobCardProps> => {
  switch (state) {
    case STATE_CONSTANTS.UNASSIGNED:
      var owner = await getProfileOfOwner(vm.job)

      return {
        elevated: false,
        description: vm.description,
        personNote: {
          pictureUrl: new URL(owner.photoURL!),
          text: i18n.tc(`${tb}.assigned`, 0, {
            name: owner.displayName
          })
        }
      }
    case STATE_CONSTANTS.ASSIGNED:
      var owner = await getProfileOfOwner(vm.job)
      
      return {
        elevated: false,
        description: vm.description,
        personNote: {
          pictureUrl: new URL(owner.photoURL!),
          text: i18n.tc(`${tb}.assigned`, 0, {
            name: owner.displayName
          })
        }
      }
    case STATE_CONSTANTS.LOST:
      return {
        elevated: false,
        personNote: {
          text: i18n.tc(`${tb}.lost`)
        }
      }
    case STATE_CONSTANTS.DELIVERED:
      var owner = await getProfileOfOwner(vm.job)

      return {
        elevated: true,
        personNote: {
          pictureUrl: new URL(owner.photoURL!),
          text: i18n.tc(`${tb}.assigned`, 0, {
            user: owner.displayName
          })
        }
      }
    case STATE_CONSTANTS.DELIVERY_CONFIRMED:
      return {
        elevated: false,
        personNote: {
          text: i18n.tc(`${tb}.delivery_confirmed`)
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