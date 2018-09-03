import Vue from "vue";
import api from './api'
import { User } from './classes'
import * as Cookies from 'js-cookie'

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
  LOGIN: 'getToken',
  LOGOUT: 'removeToken'
};

export const mutationTypes = {
  SET_USER: 'setUser',
  SET_TOKEN: 'setAuth',
  REMOVE_TOKEN: 'removeAuth'
};

export const store = {
  namespaced: true,
  state: {
    [stateKeys.TOKEN]: '',
    [stateKeys.USER]: new User()
  },
  getters: {
    [getterTypes.AUTH_HEADER]: () => {
      const token = Cookies.get(stateKeys.TOKEN);
      if (token) {
        return { Authorization: 'Token ' + token }
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
    },
    [actionTypes.GET_USER]: ({ commit, getters }) => {
      return api.getUser(user => {
        commit(mutationTypes.SET_USER, {user: new User(user.email, user.first_name, user.last_name)})
      }, {headers: getters[getterTypes.AUTH_HEADER]})
    },
    [actionTypes.LOGOUT]: ({ commit }) => {
      commit(mutationTypes.REMOVE_TOKEN);
      commit(mutationTypes.SET_USER, {user: new User()})
    }
  },
  mutations: {
    [mutationTypes.SET_USER] (state, { user }) {
      Vue.set(state, stateKeys.USER, user)
    },
    [mutationTypes.SET_TOKEN] (state, { token }) {
      Vue.set(state, stateKeys.TOKEN, token);
      Cookies.set(stateKeys.TOKEN, token, { expires: 7, secure: (process.env.NODE_ENV === 'production')})
    },
    [mutationTypes.REMOVE_TOKEN] (state) {
      Vue.delete(state, stateKeys.TOKEN);
      Cookies.remove(stateKeys.TOKEN)
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


