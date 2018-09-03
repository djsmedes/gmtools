import Vue from "vue";
import api from './api'
import { User } from './classes'

export const namespace = 'auth';

export const stateKeys = {
  TOKEN: 'token',
  USER: 'user'
};

export const getterTypes = {
  AUTH_HEADER: 'authHeader'
};

export const actionTypes = {
  GET_USER: 'getUser',
  LOGIN: 'getToken'
};

export const mutationTypes = {
  SET_USER: 'setUser',
  SET_TOKEN: 'setAuth'
};

export const store = {
  namespaced: true,
  state: {
    [stateKeys.TOKEN]: '',
    [stateKeys.USER]: new User()
  },
  getters: {
    [getterTypes.AUTH_HEADER]: state => {
      if (state[stateKeys.TOKEN]) {
        return { Authorization: 'Token ' + state[stateKeys.TOKEN] }
      } else {
        return {}
      }
    }
  },
  actions: {
    [actionTypes.LOGIN]: ({ commit }, { email, password }) => {
      return api.getToken({email, password}, token => {
        commit(mutationTypes.SET_TOKEN, { token });
        commit(mutationTypes.SET_USER, { user: new User(email) })
      })
    }
  },
  mutations: {
    [mutationTypes.SET_USER] (state, { user }) {
      Vue.set(state, stateKeys.USER, user)
    },
    [mutationTypes.SET_TOKEN] (state, { token }) {
      Vue.set(state, stateKeys.TOKEN, token)
    }
  }
};

export default {
  namespace,
  stateKeys,
  getterTypes,
  actionTypes,
  mutationTypes,
  store,
  User
}


