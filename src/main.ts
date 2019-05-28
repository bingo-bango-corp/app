import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import firebase from 'firebase/app'
import 'firebase/auth'
import firebaseConfig from './config/firebase'

import i18n from './i18n'
import VueMeta from 'vue-meta'

Vue.config.productionTip = false

let app: Object

firebase.initializeApp(firebaseConfig);

Vue.use(VueMeta)

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