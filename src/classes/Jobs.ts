import * as geofirex from 'geofirex'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/functions'
import { Observable } from 'rxjs/internal/Observable';
import store from '@/store'
const geo = geofirex.init(firebase)
const db = firebase.firestore()
const takeJob = firebase.functions().httpsCallable('takeJob')

import { PublicProfile } from '@/store/models/profile'
import { DocumentReference } from '@firebase/firestore-types';

export interface UidProfilePair {
  profile: DocumentReference,
  uid: string
}

export interface JobData {
  description: string
  thing: string
  tip: {
    cents: number
    currency: string
  }
  assigne?: UidProfilePair | undefined
}

export interface JobModel extends JobData {
  timestamp: any
  point: {
    geopoint: geofirex.firestore.GeoPoint
    geohash: string
  }
  owner: UidProfilePair
  state: 'unassigned' | 'assigned' | 'delivered' | 'cancelled'
}


export interface JobList extends Array<any> {
  [key: number]: JobModel
}


export default class Jobs {
  myPublicProfile: PublicProfile

  field: string = 'point'
  jobsCollection: geofirex.GeoFireCollectionRef = 
  geo.collection('jobs', ref => ref.where('state', '==', 'unassigned'))

  constructor() {
    if (!store.state.profile.data.uid) throw new Error('No user profile found.')
    this.myPublicProfile = store.getters.publicProfile
  }

  public async new(
    lat: number,
    long: number,
    jobData: JobData
  ): Promise<geofirex.firestore.DocumentReference> {
    const data: JobModel = {
      ...jobData,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      point: geo.point(lat, long).data,
      owner: {
        uid: this.myPublicProfile.uid,
        profile: db.collection('users').doc(this.myPublicProfile.uid)
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
    const point = geo.point(lat, long)
    const query = 
      this.jobsCollection.within(point, radius, this.field)

    const jobs = await geofirex.get(query)

    return jobs.filter((job: any) => job.owner.uid != this.myPublicProfile.uid)
  }

  public async getOwn(): Promise<JobList> {
    const query = db.collection('jobs').where("owner.uid", "==", this.myPublicProfile.uid)
    const snapshot = await query.get()
    let result: JobList = []

    snapshot.forEach(s => {
      result.push(s.data())
    })

    return result
  }

  public async getProfileForUid(uid: string): Promise<PublicProfile> {
    const query = db.collection('users').doc(uid)
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
    const point = geo.point(lat, long)
    return this.jobsCollection.within(point, radius, this.field)
  }

  public async takeJob(
    jobID: string
  ): Promise<void> {
    await takeJob({
      jobID: jobID,
      uid: this.myPublicProfile.uid
    })

    store.dispatch('currentJob/openDBChannel', {
      jobID: jobID
    })
  }
}