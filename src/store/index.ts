import Vue from 'vue'
import Vuex from 'vuex'
import VuexEasyFirestore from 'vuex-easy-firestore'
Vue.use(Vuex)

import * as Firebase from 'firebase/app'

import profile from './modules/profile'
import chat from './modules/chat'

const easyFirestore = VuexEasyFirestore(
  [chat],
  {logging: true, FirebaseDependency: Firebase}
)

const store = new Vuex.Store({
  state: {},
  modules: {
    profile
  },
  plugins: [easyFirestore]
})

export default store