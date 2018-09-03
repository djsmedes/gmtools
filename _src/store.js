import Vue from 'vue'
import Vuex from 'vuex'
import api from './auth/api'
import combatant from './models/combatant'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    ...api.state
  },
  mutations: {
    ...api.mutations
  },
  actions: {
    ...api.actions
  },
  modules: {
    [combatant.namespace]: combatant.store
  }
})
