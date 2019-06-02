import Vue from 'vue'
import Vuex from 'vuex'
import VuexEasyFirestore from 'vuex-easy-firestore'
import VuexPersistence from 'vuex-persist'
Vue.use(Vuex)

import * as Firebase from 'firebase/app'

import profile from './modules/profile'
import preferences from './modules/preferences'
import chat from './modules/chat'

const easyFirestore = VuexEasyFirestore(
  [chat],
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
    preferences
  },
  plugins: [easyFirestore, vuexLocal.plugin]
})

export default store