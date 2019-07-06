import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import registerServiceWorker from './registerServiceWorker'

import initFirebase from './initFirebase'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/messaging'

import i18n from './i18n'
import VueMeta from 'vue-meta'
import VueChatScroll from 'vue-chat-scroll'

import { attachTokenRefreshHandler } from '@/util/setUpNotifications'

Vue.config.productionTip = false

let app: Object

Vue.use(VueMeta)
Vue.use(VueChatScroll)

const initializeApp = async () => {
  await initFirebase()
  registerServiceWorker()
  const sw = await navigator.serviceWorker.ready

  firebase.messaging().useServiceWorker(sw)
  attachTokenRefreshHandler()

  firebase.auth().onAuthStateChanged(async user => {
    if (user) {
      await store.dispatch('updateProfileFromFirebase')
    }
    if (!app) {
      app = new Vue({
        router,
        store,
        i18n,
        render: h => h(App)
      }).$mount('#app')
      document.getElementById('loading')!.classList.add('hidden')
    }
  })
}

initializeApp()