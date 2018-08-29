import Vue from 'vue'
import Vuex from 'vuex'
import api from './api'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null
  },
  mutations: {
    set_object(state, { object, model }) {
      state[model][object.uuid] = object
    },
    set_user(state, { user }) {
      state['user'] = user
    }
  },
  actions: {
      ...api
  }
})
