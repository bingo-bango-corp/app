import { register } from 'register-service-worker'
import firebase from 'firebase/app'
import '@firebase/messaging'

export default async () => {
  if (process.env.NODE_ENV === 'production') {
    const messaging = firebase.messaging()
    register(`${process.env.BASE_URL}service-worker.js`, {
      async ready(registration) {
        await messaging.useServiceWorker(registration)
        console.log(
          'App is being served from cache by a service worker.\n' +
          'For more details, visit https://goo.gl/AFskqB',
        )
        return Promise.resolve()
      },
      async registered(registration) {
        await messaging.useServiceWorker(registration)
        return Promise.resolve()
      },
      updated() {
        (window as any).updateAvailable = true
      },
      error(error) {
        return Promise.reject(error)
        console.error('Error during service worker registration:', error)
      },
    })
  }
}
