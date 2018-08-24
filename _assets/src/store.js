import Vue from 'vue'
import Vuex from 'vuex'
import api from './api'

if (typeof debug !== 'undefined') {
  Vue.config.devtools = true;
}

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null
  },
  mutations: {
    set_object(state, params) {
      state[params.model][params.object.uuid] = params.object
    },
    set_user(state, params) {
      state['user'] = params.object
    }
  },
  actions: {
      ...api
  }
})
