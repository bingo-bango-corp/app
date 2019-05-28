import Vue from 'vue'
import Vuex, { Module } from 'vuex'

import profile from './modules/profile'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {},
  modules: {
    profile
  }
})

export default store