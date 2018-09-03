import Vue from "vue";
import { getToken } from './api'
import { User } from './classes'

export const namespace = 'auth';

export const stateKeys = {
  AUTHORIZATION: 'Authorization',
  USER: 'user'
};

export const getterTypes = {};

export const actionTypes = {
  GET_USER: 'getUser',
  LOGIN: 'getToken'
};

export const mutationTypes = {
  SET_USER: 'setUser',
  SET_AUTH: 'setAuth'
};

export const store = {
  namespaced: true,
  state: {
    [stateKeys.AUTHORIZATION]: '',
    [stateKeys.USER]: new User()
  },
  getters: {},
  actions: {
    [actionTypes.LOGIN]: ({ commit }, { email, password }) => {
      return getToken({email, password}, token => {
        commit(mutationTypes.SET_AUTH, { auth_string: 'Token ' + token });
        commit(mutationTypes.SET_USER, { user: new User(email) })
      })
    }
  },
  mutations: {
    [mutationTypes.SET_USER] (state, { user }) {
      Vue.set(state, stateKeys.USER, user)
    },
    [mutationTypes.SET_AUTH] (state, { auth_string }) {
      Vue.set(state, stateKeys.AUTHORIZATION, auth_string)
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


