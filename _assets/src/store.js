import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/api'

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
  }
})
