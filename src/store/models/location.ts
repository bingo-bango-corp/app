export type LocationType = {
  permission: true,
  loading: boolean,
  location: [number, number],
  accuracy: number,
  error?: any
} | {
  permission: false,
  loading: boolean
}