import Vue from 'vue'
import Vuex from 'vuex'
import combatant from './models/combatant'
import auth from './auth'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
      ...auth.store.state
  },
  getters: {
      ...auth.store.getters
  },
  actions: {
      ...auth.store.actions
  },
  mutations: {
      ...auth.store.mutations
  },
  modules: {
    [combatant.namespace]: combatant.store
  }
})
