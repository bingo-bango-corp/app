// ~config/firebase.js
import * as Firebase from 'firebase/app'
import 'firebase/firestore'

import firebaseConfig from './config/firebase'

export default () => {
  Firebase.initializeApp(firebaseConfig)
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
}
