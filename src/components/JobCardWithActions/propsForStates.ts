import firebase from 'firebase/app'
import 'firebase/firestore'

import { State, Job } from '@/store/models/job'
import { PublicProfile } from '@/store/models/profile';

interface JobCardProps {
  elevated?: boolean
  description?: string
  personNote?: {
    pictureUrl?: URL,
    text: string,
  }
}

export default async (state: State, vm: any): Promise<JobCardProps> => {
  switch (state) {
    case 'unassigned':
      return {
        elevated: true,
        description: vm.description
      }
    case 'assigned':
      var assignee = await getProfileOfAssignee(vm.job)

      return {
        elevated: true,
        personNote: {
          pictureUrl: new URL(assignee.photoURL!),
          text: `${assignee.displayName} is on it!`
        }
      }
    case 'cancelled':
      return {
        elevated: false,
        personNote: {
          text: 'You cancelled this job.'
        }
      }
    case 'lost':
      var assignee = await getProfileOfAssignee(vm.job)
      
      return {
        elevated: false,
        personNote: {
          pictureUrl: new URL(assignee.photoURL!),
          text: `${assignee.displayName} can't pick this up.`
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