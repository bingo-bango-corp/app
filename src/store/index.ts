import Vue from 'vue'
import Vuex from 'vuex'
import VuexEasyFirestore from 'vuex-easy-firestore'
import VuexPersistence from 'vuex-persist'
Vue.use(Vuex)

import * as Firebase from 'firebase/app'

import profile from './modules/profile'
import preferences from './modules/preferences'
import chat from './modules/chat'
import currentJob from './modules/currentJob'
import location from './modules/location'
import notifications from './modules/notifications'
import myJobs from './modules/myJobs'
import permissions from './modules/permissions'

const easyFirestore = VuexEasyFirestore(
  [chat, myJobs, currentJob] as any,
  {logging: true, FirebaseDependency: Firebase}
)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  modules: ['preferences']
})

const store = new Vuex.Store({
  state: {},
  modules: {
    permissions,
    profile,
    preferences,
    location,
    notifications
  },
  plugins: [easyFirestore, vuexLocal.plugin]
})

export default store