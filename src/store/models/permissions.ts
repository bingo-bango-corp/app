export default interface Permissions {
  checked: boolean
  allRequiredGranted: boolean | undefined
  location: boolean | undefined
  notifications: boolean | undefined
  messageTokenInitialized: boolean
}