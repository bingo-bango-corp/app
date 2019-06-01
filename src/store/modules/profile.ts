import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { ProfileType, PublicProfile } from '@/store/models/profile'
import firebase from 'firebase/app'
import 'firebase/auth'

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
  updateProfileFromFirebase(): Promise<ProfileType> {
    const user: firebase.User | null = firebase.auth().currentUser
    let profile: ProfileType
    if (user) {
      profile = {
        loggedIn: true,
        uid: user.uid,
        displayName: user.displayName || undefined,
        photoUrl: user.photoURL ? user.photoURL: undefined,
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
}