import { register } from 'register-service-worker'

export default async () => {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready: () => {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB',
      )
    },
    registered: (registration) => {
      console.log('registered')
    },
    updated: () => {
      (window as any).updateAvailable = true
      console.log('updated')
    },
    error: (e: Error) => {
      throw e
    },
  })
}
