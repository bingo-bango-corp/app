import * as Firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/messaging'

import firebaseConfig from './config/firebase'

export default () => {
  Firebase.initializeApp(firebaseConfig)
  Firebase.messaging().usePublicVapidKey(process.env.VUE_APP_FIREBASE_MESSAGING_KEY)
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return new Promise<void>((resolve, reject) => {
      Firebase.firestore().enablePersistence()
        .then(() => {
          resolve()
        })
        .catch((err: any) => {
          if (err.code === 'failed-precondition') {
            reject(err)
          } else if (err.code === 'unimplemented') {
            reject(err)
          }
        })
    })
  } else {
    return Promise.resolve()
  }
}
