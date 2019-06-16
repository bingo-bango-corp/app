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
    state: 'unassigned'
  }

  return db.collection('jobs').add(data)
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
  uid: string
): Promise<JobList> => {
  const db = firebase.firestore()

  const snapshot = 
    await db.collection('jobs').where("owner.uid", "==", uid).get()
  
  let result: any = {}

  snapshot.forEach(s => result = {
    ...result,
    [s.id]: s.data()
  })

  return result
}

export const takeJob = async (
  uid: string,
  jobID: string
): Promise<void> => {
  await firebase.functions().httpsCallable('takeJob')({
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
  const db = firebase.firestore()

  const snap = await db
    .collection('jobs')
    .where('assignee.uid', '==', uid)
    .where('state', '==', 'assigned')
    .get()

  if (!snap.empty) {
    if (!doesCurrentJobExist()) {
      await store.dispatch('currentJob/openDBChannel', {
        jobID: snap.docs[0].id
      })
    }
  } else {
    if (doesCurrentJobExist()) {
      store.dispatch('currentJob/closeDBChannel', {clearModule: true})
    }
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
  return (store.state.currentJob.data.state)
}