import { register } from 'register-service-worker'

export default async () => {
  if (process.env.NODE_ENV === 'production') {
    register(`${process.env.BASE_URL}service-worker.js`, {
      async ready() {
        console.log(
          'App is being served from cache by a service worker.\n' +
          'For more details, visit https://goo.gl/AFskqB',
        )
        return Promise.resolve()
      },
      async registered(registration) {
        return Promise.resolve()
      },
      updated() {
        (window as any).updateAvailable = true
      },
      error(error) {
        console.error('Error during service worker registration:', error)
        return Promise.reject(error)
      },
    })
  }
}
