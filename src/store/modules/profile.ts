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
        photoURL: this.data.photoURL,
        displayName: this.data.displayName
      }
    } else {
      return null
    }
  }

  get uid(): string | null {
    if (this.data.loggedIn) return this.data.uid
    return null
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
      const remoteUserProfile = await db
        .collection('users')
        .doc(user.uid)
        .get()

      let displayName: string | undefined = undefined
      let photoURL: string | undefined = undefined
      
      if (remoteUserProfile.exists) {
        const remoteUserProfileData = remoteUserProfile.data()
        displayName = remoteUserProfileData!.displayName
        photoURL = remoteUserProfileData!.photoURL
      }

      profile = {
        loggedIn: true,
        uid: user.uid,
        email: user.email || undefined,
        displayName: displayName || user.displayName || undefined,
        photoURL: photoURL || user.photoURL || undefined,
        emailVerified: user.emailVerified,
        byAuthProvider: user.providerData
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