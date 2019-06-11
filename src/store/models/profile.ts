import { DocumentReference } from '@firebase/firestore-types';

export type ProfileType = {
  loggedIn: false
} | {
  loggedIn: true
  uid: string,
  email?: string,
  displayName?: string,
  photoUrl?: string,
  emailVerified: boolean,
  byAuthProvider: Array<any>
}
export interface PublicProfile {
  uid: string,
  displayName?: string,
  photoUrl?: string,
}

export interface PublicProfileRef {
  uid: string,
  profile: DocumentReference
}