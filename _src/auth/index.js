import Vue from "vue";
import api from "./api";
import userModule, { User } from "@/models/user";
import campaignModule from "@/models/campaign";
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
  IS_USER_AUTHENTICATED: "isUserAuthenticated",
  CURRENT_CAMPAIGN: "currentCampaign"
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
    [getterTypes.CURRENT_CAMPAIGN]: (
      state,
      getters,
      rootState,
      rootGetters
    ) => {
      let user = getters[getterTypes.AUTH_USER];
      if (!user) return;
      let campaignUuid = user.current_campaign;
      if (!campaignUuid) return;
      let campaignByIdGetterName =
        campaignModule.namespace + "/" + campaignModule.getterTypes.BY_ID;
      return rootGetters[campaignByIdGetterName](campaignUuid);
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
      try {
        let token = await api.getToken({ email, password });
        commit(mutationTypes.SET_TOKEN, { token });
        await dispatch(actionTypes.GET_USER);
      } catch (err) {
        if (err.response && err.response.status === 400) {
          return err.response.data;
        } else if (
          err.response &&
          err.response.status === 401 &&
          err.response.data &&
          err.response.data.detail === "Invalid token."
        ) {
          commit(mutationTypes.REMOVE_TOKEN);
        } else {
          throw err;
        }
      }
    },
    [actionTypes.GET_USER]: async ({ commit, dispatch }) => {
      try {
        let user = await api.getUser();
        dispatch(actionTypes.SET_AUTH_USER, user);
      } catch (err) {
        // eslint-disable-next-line
        if (process.env.NODE_ENV !== "production") console.warn(err);
        commit(mutationTypes.CLEAR_AUTH_USER);
        if (
          err.response &&
          err.response.status === 401 &&
          err.response.data &&
          err.response.data.detail === "Invalid token."
        ) {
          commit(mutationTypes.REMOVE_TOKEN);
        }
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
      // todo - clear basically all other data out of vuex
    },
    [actionTypes.SIGNUP]: async (
      { commit, dispatch },
      { email, password1, password2 }
    ) => {
      try {
        let { user, token } = await api.signUp({ email, password1, password2 });
        commit(mutationTypes.SET_TOKEN, { token });
        dispatch(actionTypes.SET_AUTH_USER, user);
      } catch (err) {
        if (err.response && err.response.status === 400) {
          return err.response.data;
        } else {
          throw err;
        }
      }
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
