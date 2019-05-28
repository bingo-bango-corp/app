export type ProfileType = {
  loggedIn: false
} | {
  loggedIn: true
  uid: string,
  displayName?: string,
  photoUrl?: URL,
  emailVerified: boolean,
}