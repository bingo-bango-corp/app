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
        console.log('Service worker has been registered.')
        return Promise.resolve()
      },
      cached() {
        console.log('Content has been cached for offline use.')
      },
      updatefound() {
        console.log('New content is downloading.')
      },
      updated() {
        (window as any).updateAvailable = true
      },
      offline() {
        console.log('No internet connection found. App is running in offline mode.')
      },
      error(error) {
        return Promise.reject(error)
        console.error('Error during service worker registration:', error)
      },
    })
  }
}
