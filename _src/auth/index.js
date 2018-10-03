import Vue from "vue";
import api from "./api";
import userModule, { User } from "@/models/user";
import * as Cookies from "js-cookie";
import axios from "axios";

export const namespace = "auth";

export const stateKeys = {
  TOKEN: "authToken",
  AUTH_USER: "authUser",
  PASS_RESET_USER_KEY: "passResetUserKey",
  PASS_RESET_TOKEN: "passResetToken"
};

export const getterTypes = {
  AUTH_HEADER: "authHeader",
  AUTH_USER: "authUser",
  WAS_AUTH_USER_REQUESTED: "wasAuthUserRequested",
  IS_USER_AUTHENTICATED: "isUserAuthenticated"
};

export const actionTypes = {
  GET_USER: "getUser",
  SET_AUTH_USER: "setAuthUser",
  SIGNUP: "signUp",
  LOGIN: "getToken",
  LOGOUT: "removeToken"
};

export const mutationTypes = {
  SET_USER: "setUser",
  SET_AUTH_USER: "setAuthUser",
  CLEAR_AUTH_USER: "clearAuthUser",
  SET_TOKEN: "setAuth",
  REMOVE_TOKEN: "removeAuth",
  SET_PASS_RESET_DATA: "setPassResetData",
  CLEAR_PASS_RESET_DATA: "clearPassResetData"
};

export const store = {
  namespaced: true,
  state: {},
  getters: {
    [getterTypes.AUTH_HEADER]: () => {
      let token = Cookies.get(stateKeys.TOKEN);
      if (token) {
        return { Authorization: "Token " + token };
      } else {
        return {};
      }
    },
    [getterTypes.AUTH_USER]: (state, getters, rootState, rootGetters) => {
      if (!getters[getterTypes.WAS_AUTH_USER_REQUESTED]) {
        return;
      }
      let userByIdGetterName =
        userModule.namespace + "/" + userModule.getterTypes.BY_ID;
      return rootGetters[userByIdGetterName](state[stateKeys.AUTH_USER]);
    },
    [getterTypes.WAS_AUTH_USER_REQUESTED]: state => {
      return typeof state[stateKeys.AUTH_USER] !== "undefined";
    },
    [getterTypes.IS_USER_AUTHENTICATED]: (state, getters) => {
      let user = getters[getterTypes.AUTH_USER];
      if (typeof user === "undefined") return false;
      return user.email.length !== 0;
    }
  },
  actions: {
    [actionTypes.LOGIN]: async ({ commit, dispatch }, { email, password }) => {
      let token = await api.getToken({ email, password });
      commit(mutationTypes.SET_TOKEN, { token });
      return dispatch(actionTypes.GET_USER);
    },
    [actionTypes.GET_USER]: async ({ commit, dispatch }) => {
      try {
        let user = await api.getUser();
        dispatch(actionTypes.SET_AUTH_USER, user);
      } catch (err) {
        if (process.env.NODE_ENV !== "production") console.warn(err);
        commit(mutationTypes.CLEAR_AUTH_USER);
      }
    },
    [actionTypes.SET_AUTH_USER]: ({ commit }, user) => {
      if (!user.uuid) {
        commit(mutationTypes.CLEAR_AUTH_USER);
      } else {
        commit(mutationTypes.SET_AUTH_USER, user.uuid);
        commit(
          userModule.namespace + "/" + userModule.mutationTypes.SET,
          { object: new User(user) },
          {
            root: true
          }
        );
      }
    },
    [actionTypes.LOGOUT]: ({ commit }) => {
      commit(mutationTypes.REMOVE_TOKEN);
      commit(mutationTypes.CLEAR_AUTH_USER);
      return Promise.resolve();
      // todo - clear basically all other data out of vuex
    },
    [actionTypes.SIGNUP]: (
      { commit, dispatch },
      { email, password1, password2 }
    ) => {
      return api.signUp({ email, password1, password2 }, ({ user, token }) => {
        commit(mutationTypes.SET_TOKEN, { token });
        dispatch(actionTypes.SET_AUTH_USER, user);
      });
    }
  },
  mutations: {
    [mutationTypes.SET_AUTH_USER](state, uuid) {
      Vue.set(state, stateKeys.AUTH_USER, uuid);
    },
    [mutationTypes.CLEAR_AUTH_USER](state) {
      Vue.set(state, stateKeys.AUTH_USER, "");
    },
    [mutationTypes.SET_TOKEN](state, { token }) {
      Cookies.set(stateKeys.TOKEN, token, {
        expires: 7,
        secure: process.env.NODE_ENV === "production"
      });
      axios.defaults.headers["common"] = {
        Authorization: "Token " + token
      };
    },
    [mutationTypes.REMOVE_TOKEN]() {
      Cookies.remove(stateKeys.TOKEN);
      axios.defaults.headers["common"] = {
        Authorization: ""
      };
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
};
