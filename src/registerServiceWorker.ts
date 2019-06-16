import { register } from 'register-service-worker'
import firebase from 'firebase/app'
import '@firebase/messaging'

export default () => {
  if (process.env.NODE_ENV === 'production') {
    const messaging = firebase.messaging()
    register(`${process.env.BASE_URL}service-worker.js`, {
      ready() {
        console.log(
          'App is being served from cache by a service worker.\n' +
          'For more details, visit https://goo.gl/AFskqB',
        )
      },
      registered(registration) {
        messaging.useServiceWorker(registration)
        console.log('Service worker has been registered.')
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
        console.error('Error during service worker registration:', error)
      },
    })
  }
}
