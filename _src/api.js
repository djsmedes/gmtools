import axios from 'axios'
import Vue from 'vue'

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export const models = {
  USER: 'user',
};

export const actionTypes = {
  GET_USER: 'get_user',
  GET_TOKEN: 'get_token'
};

export const mutationTypes = {
  SET_USER: 'set_user',
  SET_AUTH: 'set_auth'
};

export default {
  models: models,
  state: {
    [models.USER]: {},
    [models.COMBATANT]: {},
    Authorization: ''
  },
  actionTypes: actionTypes,
  actions: {
    [actionTypes.GET_TOKEN] ({ commit }, { username, password }) {
      return axios.post(
          '/api/token-auth/', {
            username: username,
            password: password
          }
      ).then(r => {
        commit(mutationTypes.SET_AUTH, { auth_string: 'Token ' + r.data.token })
      }).catch(e => {
        console.log(e)
      })
    },
    [actionTypes.GET_USER] ({ state, commit }) {
      return axios.get(
          '/api/request-user/', { headers: { Authorization: state.Authorization } }
      ).then(r => {
        commit({
          type: mutationTypes.SET_USER,
          user: r.data
        })
      }).catch(e => {
        console.log(e)
      })
    },
  },
  mutationTypes: mutationTypes,
  mutations: {
    [mutationTypes.SET_USER] (state, { user }) {
      Vue.set(state, 'user', user)
    },
    [mutationTypes.SET_AUTH] (state, { auth_string }) {
      Vue.set(state, 'Authorization', auth_string)
    }
  }
}
