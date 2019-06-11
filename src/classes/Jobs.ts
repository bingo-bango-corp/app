import * as geofirex from 'geofirex'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/functions'
import { Observable } from 'rxjs/internal/Observable'
import { PublicProfileRef } from '@/store/models/profile'
import store from '@/store'

import { PublicProfile } from '@/store/models/profile'
import { Job } from '@/store/models/job'

export interface JobData {
  description: string
  thing: string
  tip: {
    cents: number
    currency: string
  }
  assigne?: PublicProfileRef | undefined
}


export interface JobList extends Array<any> {
  [key: number]: Job
}


export default class Jobs {
  geo = geofirex.init(firebase)
  db = firebase.firestore()
  takeJobFunction = firebase.functions().httpsCallable('takeJob')

  myPublicProfile: PublicProfile

  field: string = 'point'
  jobsCollection: geofirex.GeoFireCollectionRef = 
  this.geo.collection('jobs', ref => ref.where('state', '==', 'unassigned'))

  constructor() {
    if (!store.state.profile.data.uid) throw new Error('No user profile found.')
    this.myPublicProfile = store.getters.publicProfile
  }

  public async new(
    lat: number,
    long: number,
    jobData: JobData
  ): Promise<geofirex.firestore.DocumentReference> {
    const data: Job = {
      ...jobData,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      point: this.geo.point(lat, long).data,
      owner: {
        uid: this.myPublicProfile.uid,
        profile: this.db.collection('users').doc(this.myPublicProfile.uid)
      },
      state: 'unassigned'
    } 
    return this.jobsCollection.add(data)
  }  

  public async query(
    lat: number, 
    long: number, 
    radius: number
  ): Promise<any> {
    const point = this.geo.point(lat, long)
    const query = 
      this.jobsCollection.within(point, radius, this.field)

    const jobs = await geofirex.get(query)

    return jobs.filter((job: any) => job.owner.uid != this.myPublicProfile.uid)
  }

  public async getOwn(): Promise<JobList> {
    const query = this.db.collection('jobs').where("owner.uid", "==", this.myPublicProfile.uid)
    const snapshot = await query.get()
    let result: JobList = []

    snapshot.forEach(s => {
      result.push(s.data())
    })

    return result
  }

  public async getProfileForUid(uid: string): Promise<PublicProfile> {
    const query = this.db.collection('users').doc(uid)
    const snapshot = await query.get()

    if (snapshot.exists) {
      return snapshot.data() as PublicProfile
    }

    throw new Error('This user does not exist!')
  }

  public initializeOwnJobsStore(): void {
    store.dispatch('myJobs/openDBChannel', {
      where: [["owner.uid", "==", this.myPublicProfile.uid]]
    })
  }

  public subscribe(
    lat: number, 
    long: number, 
    radius: number
  ): Observable<geofirex.GeoQueryDocument[]> {
    const point = this.geo.point(lat, long)
    return this.jobsCollection.within(point, radius, this.field)
  }

  public async takeJob(
    jobID: string
  ): Promise<void> {
    await this.takeJobFunction({
      jobID: jobID,
      uid: this.myPublicProfile.uid
    })

    store.dispatch('currentJob/openDBChannel', {
      jobID: jobID
    })
  }

  public async updateCurrentJobStore() {
    if (store.state.currentJob.data.state) return Promise.resolve()

    const snap = await this.db
      .collection('jobs')
      .where('assignee.uid', '==', this.myPublicProfile.uid)
      .where('state', '==', 'assigned')
      .get()

    if (!snap.empty) {
      await store.dispatch('currentJob/openDBChannel', {
        jobID: snap.docs[0].id
      })
    }
  }
  
}