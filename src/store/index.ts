import Vue from 'vue'
import Vuex from 'vuex'
import VuexEasyFirestore from 'vuex-easy-firestore'
import VuexPersistence from 'vuex-persist'
Vue.use(Vuex)

import * as Firebase from 'firebase/app'

import profile from './modules/profile'
import preferences from './modules/preferences'
import chat from './modules/chat'
import myJobs from './modules/myJobs'
import location from './modules/location'

const easyFirestore = VuexEasyFirestore(
  [chat, myJobs],
  {logging: true, FirebaseDependency: Firebase}
)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  modules: ['preferences']
})

const store = new Vuex.Store({
  state: {},
  modules: {
    profile,
    preferences,
    location
  },
  plugins: [easyFirestore, vuexLocal.plugin]
})

export default store