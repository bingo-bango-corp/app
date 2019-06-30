import i18n from '@/i18n'
import { 
  OWNER_TRANSITIONS,
  ASSIGNEE_TRANSITIONS,
  JobRelationship,
  Transition
} from '@/store/models/job'
import { PublicProfile } from '@/store/models/profile';
import { Notice, Message } from './types';

// translation base path
const tb = 'chat.events'

export default (
  message: Message | Notice,
  role: JobRelationship,
  otherPersonsPublicProfile: PublicProfile
) => {
  return (message as Notice).type === 'notice'
    ? adaptNotice(
        (message as Notice),
        role,
        otherPersonsPublicProfile
      )
    : (message as Message).message
}

const adaptNotice = (
  message: Notice,
  role: JobRelationship,
  otherPersonsPublicProfile: PublicProfile
  ): string | undefined => {
  return translationWithUser(
    stringsForEventType[message.event],
    message.event,
    role,
    otherPersonsPublicProfile
  )
}

const stringsForEventType: {
  [key in Transition]: string
} = {
  'assign': 'assign',
  'cancel': 'cancel',
  'confirm_delivery': 'confirm_delivery',
  'deliver': 'deliver',
  'drop': 'drop'
}

const translationWithUser = (
  stringId: string,
  event: string,
  role: JobRelationship,
  otherPersonsPublicProfile: PublicProfile
): string | undefined => {
  const actionTakenByOwner = OWNER_TRANSITIONS.includes(event)
  const actionTakenByAssignee = ASSIGNEE_TRANSITIONS.includes(event)

  if (
    actionTakenByOwner && role === 'owner' ||
    actionTakenByAssignee && role === 'assignee'
  ) {
    return i18n.tc(`${tb}.you_did.${stringId}`)
  } else {
    return i18n.tc(`${tb}.they_did.${stringId}`, 0, {
      user: otherPersonsPublicProfile.displayName
    })
  }
}