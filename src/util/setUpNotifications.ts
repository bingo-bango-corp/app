import firebase from 'firebase/app'
import '@firebase/messaging'
import '@firebase/firestore'

export default async (uid: string) => {
  const db = firebase.firestore()
  const messaging = firebase.messaging()

  const permission = await Notification.requestPermission()

  if (permission != 'granted') {
    return Promise.reject()
  }

  handleMessageTokenUpdate(db, messaging, uid)

  messaging.onTokenRefresh(async () => {
    handleMessageTokenUpdate(db, messaging, uid)
  })

  messaging.onMessage(payload => {
    const {title, ...options} = payload.notification;
    navigator.serviceWorker.ready.then(registration => {
      registration.showNotification(title, options)
    })
  })
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

  return Promise.resolve()
}

const writeTokenToUser = (db: any, token: string, uid: string) => {
  console.log(`writing token ${token} to ${uid}`)
  return db
    .collection('users')
    .doc(uid)
    .collection('private')
    .doc('privateProfile')
    .update({
      messageToken: token
    })
}