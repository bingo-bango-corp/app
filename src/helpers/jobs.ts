import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/functions'
import * as geofirex from 'geofirex'

import store from '@/store'

import { PublicProfileRef } from '@/store/models/profile'
import { Job } from '@/store/models/job'

export interface JobData {
  description: string
  thing: string
  tip: {
    cents: number
    currency: string
  }
  assigne?: PublicProfileRef | undefined
}

export interface JobList {
  [id: string]: Job
}

export const createJob = (
  uid: string,
  lat: number,
  long: number,
  jobData: JobData
): Promise<firebase.firestore.DocumentReference> => {
  const db = firebase.firestore()
  const geo = geofirex.init(firebase)

  const data: Job = {
    ...jobData,
    timestamp: 
      firebase.firestore.FieldValue.serverTimestamp(),
    point: geo.point(lat, long).data,
    owner: {
      uid: uid,
      profile: db.collection('users').doc(uid)
    },
    terminal: false,
    state: 'unassigned'
  }

  return store.dispatch('myJobs/insert', data)
}

export const queryNearbyJobs = async (
  uid: string,
  lat: number,
  long: number,
  radius: number
) => {
  const geo = geofirex.init(firebase)

  const jobsCollection = 
    geo.collection('jobs', ref => ref.where('state', '==', 'unassigned'))

  const point = geo.point(lat, long)
  const query =
    jobsCollection.within(point, radius, 'point')

  const jobs = await geofirex.get(query)

  return jobs.filter(
    (job: Job) => job.owner.uid != uid
  )
}

export const getOwnJobs = async (
  uid: string,
  filter?: {
    only: 'closed' | 'open'
  }
): Promise<JobList> => {
  const db = firebase.firestore()
  let query = db.collection('jobs').where('owner.uid', '==', uid)

  if (filter) {
    if (filter.only === 'open') {
      query = query.where('open', '==', true)
    } else if (filter.only === 'closed') {
      query = query.where('open', '==', false)
    }
  }

  const snapshot = await query.get()
  
  let result: any = {}

  snapshot.forEach(s => result = {
    ...result,
    [s.id]: s.data()
  })

  return result
}

export const cancelJob = async (
  jobID: string,
  uid: string
): Promise<void> => {
  await firebase.app().functions('europe-west1').httpsCallable('cancelJob')({
    jobID: jobID,
    uid: uid
  })
}

export const deliverJob = async (
  jobID: string,
  uid: string
): Promise<void> => {
  await firebase.app().functions('europe-west1').httpsCallable('deliverJob')({
    jobID: jobID,
    uid: uid
  })
}

export const confirmDelivery = async (
  jobID: string,
  uid: string
): Promise<void> => {
  await firebase.app().functions('europe-west1').httpsCallable('confirmDelivery')({
    jobID: jobID,
    uid: uid
  })
}

export const dropJob = async (
  uid: string,
  jobID: string
): Promise<void> => {
  await firebase.app().functions('europe-west1').httpsCallable('dropJob')({
    jobID: jobID,
    uid: uid
  })

  await unsubscribeFromJob()
}

export const takeJob = async (
  jobID: string,
  uid: string
): Promise<void> => {
  await firebase.app().functions('europe-west1').httpsCallable('takeJob')({
    jobID: jobID,
    uid: uid
  })

  store.dispatch('currentJob/openDBChannel', {
    jobID: jobID
  })
}

export const updateCurrentJobStore = async (
  uid: string
) => {
  if (!doesCurrentJobExist()) {
    const db = firebase.firestore()

    let snapshots: Promise<firebase.firestore.QuerySnapshot>[] = []

    const assignedQuery = await db
      .collection('jobs')
      .where('assignee.uid', '==', uid)
      .where('state', '==', 'assigned')

    // terrible double query until Firebase can figure out IN queries.
    const deliveredQuery = await db
      .collection('jobs')
      .where('assignee.uid', '==', uid)
      .where('state', '==', 'delivered')

    snapshots = [
      assignedQuery.get(),
      deliveredQuery.get()
    ]

    const results = await Promise.all(snapshots)
    const snap = results.find(s => !s.empty)
    
    if (snap) {
      await store.dispatch('currentJob/openDBChannel', {
        jobID: snap!.docs[0].id
      })
    }
  }
}

export const ensureMyJobsSynced = async () => {
  if (!isMyJobsSynced()) {
    await store.dispatch('myJobs/openDBChannel')
  } else {
    return Promise.resolve()
  }
}

export const subscribeToJob = async (
  jobID: string
) => {
  await store.dispatch('viewedJob/openDBChannel', {
    jobID: jobID
  })
}

export const unsubscribeFromJob = async () => {
  await store.dispatch('viewedJob/closeDBChannel', {
    clearModule: true
  })
}

export const doesCurrentJobExist = (): boolean => {
  return (store.state.currentJob._sync.signedIn)
}

export const isMyJobsSynced = (): boolean => {
  return (store.state.myJobs._sync.signedIn)
}
