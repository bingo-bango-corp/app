import firebase from 'firebase/app'
import store from '@/store'
import '@firebase/messaging'
import '@firebase/firestore'

export const attachTokenRefreshHandler = (): void => {
  const messaging = firebase.messaging()

  messaging.onTokenRefresh(() => {
    writeCurrentTokenToUser()
  })
}

export const writeCurrentTokenToUser = async (): Promise<void> => {
  const db = firebase.firestore()
  const token = await firebase.messaging().getToken()

  console.log('writeCurrentToken')

  return db
    .collection('users')
    .doc(store.getters.uid)
    .collection('private')
    .doc('privateProfile')
    .update({
      messageToken: token
    }).catch(e => {
      console.error(e)
    })
}

export const requestPermission = async (): Promise<void> => {
  const permission = await Notification.requestPermission()

  if (permission !== 'granted') {
    return Promise.reject('Permission not granted')
  }
}