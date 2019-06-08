import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { ProfileType, PublicProfile } from '@/store/models/profile'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

@Module
export default class Profile extends VuexModule {
  data: ProfileType = {
    loggedIn: false
  }

  get publicProfile(): PublicProfile | null {
    if (this.data.loggedIn) {
      return {
        uid: this.data.uid,
        photoUrl: this.data.photoUrl,
        displayName: this.data.displayName
      }
    } else {
      return null
    }
  }

  @Mutation
  writeProfile(profile: ProfileType) {
    this.data = profile
  }

  @Action({ commit: 'writeProfile' })
  async updateProfileFromFirebase(): Promise<ProfileType> {
    const user: firebase.User | null = firebase.auth().currentUser
    let profile: ProfileType
    if (user) {
      const db = firebase.firestore()
      const remoteUserProfile = await db.collection('users').doc(user.uid).get()
      const { displayName, photoURL } = remoteUserProfile.data() as any

      profile = {
        loggedIn: true,
        uid: user.uid,
        displayName: displayName || user.displayName || undefined,
        photoUrl: photoURL || user.photoURL || undefined,
        emailVerified: user.emailVerified
      } 
    } else {
      profile = {
        loggedIn: false
      } 
    }
    return Promise.resolve(profile)
  }

  @Action({ commit: 'writeProfile' })
  async signOut(): Promise<ProfileType> {
    await firebase.auth().signOut()
    const profile: ProfileType = {
      loggedIn: false
    }
    return Promise.resolve(profile)
  }

  @Action({ commit: 'writeProfile' })
  setDisplayName(name: string): ProfileType {
    if (this.data.loggedIn) {
      const profile: ProfileType = {
        ...this.data,
        displayName: name
      }
      return profile
    } else {
      throw new Error('Cannot set display name if no-one is logged in.')
    }
  }

  @Action
  async updateRemoteDisplayName(): Promise<void> {
    if (this.data.loggedIn) {
      const db = firebase.firestore()
      await db.collection('users').doc(this.data.uid).update({
        'displayName': this.data.displayName
      }).catch((e) => {
        throw new Error(e)
      })
    } else {
      throw new Error('Cannot update remote user name if no-one is logged in.')
    }
  }
}