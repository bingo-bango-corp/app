import * as geofirex from 'geofirex'
import firebase from 'firebase/app'
import { Observable } from 'rxjs/internal/Observable';
import store from '@/store'
const geo = geofirex.init(firebase)

import { PublicProfile } from '@/store/models/profile'


export interface JobData {
  description: string
  thing: string
  tip: {
    cents: number
    currency: string
  }
  assigne?: PublicProfile | undefined
}


export interface JobModel extends JobData {
  point: {
    geopoint: geofirex.firestore.GeoPoint
    geohash: string
  }
  owner: PublicProfile
}


export default class Jobs {
  myPublicProfile: PublicProfile

  field: string = 'point'
  jobsCollection: geofirex.GeoFireCollectionRef = 
    geo.collection('jobs')

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
      point: geo.point(lat, long).data,
      owner: this.myPublicProfile
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
    return geofirex.get(query)
  }

  public subscribe(
    lat: number, 
    long: number, 
    radius: number
  ): Observable<geofirex.GeoQueryDocument[]> {
    const point = geo.point(lat, long)
    return this.jobsCollection.within(point, radius, this.field)
  }
}