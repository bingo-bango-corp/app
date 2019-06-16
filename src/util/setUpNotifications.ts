import firebase from 'firebase/app'
import '@firebase/messaging'
import '@firebase/firestore'

export default async (uid: string) => {
  const db = firebase.firestore()
  const messaging = firebase.messaging()

  const permission = await Notification.requestPermission()

  if (permission !== 'granted') {
    return Promise.reject()
  }

  messaging.onTokenRefresh(async () => {
    handleMessageTokenUpdate(db, messaging, uid)
  })

  messaging.onMessage(payload => {
    const {title, ...options} = payload.notification;
    navigator.serviceWorker.ready.then(registration => {
      registration.showNotification(title, options)
    })
  })

  await handleMessageTokenUpdate(db, messaging, uid)
}

const handleMessageTokenUpdate = async (
  db: any,
  messaging: any,
  uid: string
) => {
  const token = await messaging.getToken()

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