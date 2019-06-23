import firebase from 'firebase/app'
import store from '@/store'
import '@firebase/messaging'
import '@firebase/firestore'

export default async (uid: string) => {
  if (process.env.NODE_ENV === 'production') {
    const permission = await Notification.requestPermission()

    if (permission !== 'granted') {
      return Promise.reject()
    }

    handleMessageTokenUpdate()
  }
}

export const setUpServiceWorker = async () => {
  if (process.env.NODE_ENV === 'production') {
    const registration = await navigator.serviceWorker.ready
    const messaging = firebase.messaging()

    await messaging.useServiceWorker(registration)

    messaging.onTokenRefresh(async () => {
      handleMessageTokenUpdate()
    })

    messaging.onMessage(payload => {
      const { 
        title, 
        type,
        body,
        link
      } = payload.data

      const notificationOptions = {
        body: body,
        icon: '/round-icon.png',
        priority: 2,
        data: {
          url: link
        }
      }

      console.log('Dispatching foreground notification', type, notificationOptions)

      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, notificationOptions)
      })
    })
  }
}

const handleMessageTokenUpdate = async () => {
  console.log('handleUpdate')
  const messaging = firebase.messaging()
  const token = await messaging.getToken()
  const db = firebase.firestore()
  const uid = store.getters.publicProfile.uid

  if (!token) {
    return Promise.reject()
  }

  await writeTokenToUser(db, token, uid)
}

const writeTokenToUser = (db: any, token: string, uid: string) => {
  return db
    .collection('users')
    .doc(uid)
    .collection('private')
    .doc('privateProfile')
    .update({
      messageToken: token
    })
}