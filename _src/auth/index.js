import Vue from "vue";
import api from './api'
import { User } from './classes'
import * as Cookies from 'js-cookie'
import debounce from 'debounce-promise'

export const namespace = 'auth';

export const stateKeys = {
  TOKEN: 'authToken',
  USER: 'user'
};

export const getterTypes = {
  AUTH_HEADER: 'authHeader'
};

export const actionTypes = {
  GET_USER: 'getUser',
  LOGIN: 'getToken',
  LOGOUT: 'removeToken',
  SIGNUP: 'signUp'
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
    [getterTypes.AUTH_HEADER]: state => {
      let token = state[stateKeys.TOKEN];
      if (!token) {
        token = Cookies.get(stateKeys.TOKEN);
        if (token) state[stateKeys.TOKEN] = token;
      }
      if (token) {
        return { Authorization: 'Token ' + token }
      } else {
        return {}
      }
    }
  },
  actions: {
    [actionTypes.LOGIN]: async ({ commit, dispatch }, { email, password }) => {
      await api.getToken({ email, password }, token => {
        commit(mutationTypes.SET_TOKEN, { token });
      });
      return dispatch(actionTypes.GET_USER);
    },
    [actionTypes.GET_USER]: debounce(({ commit, getters }) => {
      return api.getUser(user => {
        commit(mutationTypes.SET_USER, { user: new User({ ...user, requested: true }) })
      }, { headers: getters[getterTypes.AUTH_HEADER] })
    }, 25),
    [actionTypes.LOGOUT]: ({ commit }) => {
      commit(mutationTypes.REMOVE_TOKEN);
      commit(mutationTypes.SET_USER, { user: new User({ requested: true }) });
      return Promise.resolve()
      // todo - clear basically all other data out of vuex...?
    },
    [actionTypes.SIGNUP]: ({ commit }, { email, password1, password2 }) => {
      return api.signUp({ email, password1, password2 }, ({ user, token }) => {
        commit(mutationTypes.SET_TOKEN, { token });
        commit(mutationTypes.SET_USER, { user: new User({ ...user, requested: true }) });
      })
    }
  },
  mutations: {
    [mutationTypes.SET_USER] (state, { user }) {
      Vue.set(state, stateKeys.USER, user)
    },
    [mutationTypes.SET_TOKEN] (state, { token }) {
      Vue.set(state, stateKeys.TOKEN, token);
      Cookies.set(stateKeys.TOKEN, token, { expires: 7, secure: (process.env.NODE_ENV === 'production') })
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


