export type ProfileType = {
  loggedIn: false
} | {
  loggedIn: true
  uid: string,
  displayName?: string,
  photoUrl?: string,
  emailVerified: boolean,
}
export interface PublicProfile {
  uid: string,
  displayName?: string,
  photoUrl?: string,
}