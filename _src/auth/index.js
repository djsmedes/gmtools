import Vue from "vue";
import * as Cookies from "js-cookie";
import axios from "axios";
import { generateUrl2 as generateUrl } from "@/utils/urls";
import { actionTypes, stateKeys, mutationTypes, getterTypes } from "./vuexKeys";
import store from "@/store";
import fromPairs from "lodash/fromPairs";
import { User, CampaignList } from "@/models";

const moduleName = "auth";

export const authGetters = fromPairs(
  Object.entries(getterTypes).map(([key, value]) => [
    key,
    moduleName + "/" + value,
  ])
);

export const authActions = fromPairs(
  Object.entries(actionTypes).map(([key, value]) => [
    key,
    moduleName + "/" + value,
  ])
);

export const authMutations = fromPairs(
  Object.entries(mutationTypes).map(([key, value]) => [
    key,
    moduleName + "/" + value,
  ])
);

const authModule = {
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
    [getterTypes.AUTH_USER_UUID]: state => {
      return state[stateKeys.AUTH_USER];
    },
    [getterTypes.CURRENT_CAMPAIGN_UUID]: state => {
      return state[stateKeys.CURRENT_CAMPAIGN];
    },
  },
  actions: {
    [actionTypes.LOGIN]: async ({ commit, dispatch }, { email, password }) => {
      try {
        let { data } = await axios.post(generateUrl("token-auth"), {
          username: email,
          password: password,
        });
        commit(mutationTypes.SET_TOKEN, data);
        await dispatch(actionTypes.GET_USER);
      } catch (err) {
        if (err.response && err.response.status === 400) {
          return err.response.data;
        } else if (
          err.response &&
          [401, 403].includes(err.response.status) &&
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
        let { data } = await axios.get(generateUrl("request-user"));
        let { user, campaigns } = data;
        dispatch(actionTypes.SET_AUTH_USER, user);
        if (user) new User(user).sync();
        if (campaigns) new CampaignList(campaigns).sync();
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
        } else {
          throw err;
        }
      }
    },
    [actionTypes.SET_AUTH_USER]: ({ commit }, user) => {
      if (!user.uuid) {
        commit(mutationTypes.CLEAR_AUTH_USER);
      } else {
        commit(mutationTypes.SET_AUTH_USER, user);
        commit(mutationTypes.SET_CURRENT_CAMPAIGN, user.current_campaign);
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
        let { data } = await axios.post(generateUrl("signup"), {
          email,
          password1,
          password2,
        });
        let { user, token } = data;

        commit(mutationTypes.SET_TOKEN, { token });
        dispatch(actionTypes.SET_AUTH_USER, user);
      } catch (err) {
        if (err.response && err.response.status === 400) {
          return err.response.data;
        } else {
          throw err;
        }
      }
    },
  },
  mutations: {
    [mutationTypes.SET_AUTH_USER](state, { uuid }) {
      Vue.set(state, stateKeys.AUTH_USER, uuid);
    },
    [mutationTypes.CLEAR_AUTH_USER](state) {
      Vue.set(state, stateKeys.AUTH_USER, "");
    },
    [mutationTypes.SET_CURRENT_CAMPAIGN](state, uuid) {
      Vue.set(state, stateKeys.CURRENT_CAMPAIGN, uuid);
    },
    [mutationTypes.SET_TOKEN](state, { token }) {
      Cookies.set(stateKeys.TOKEN, token, {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
      });
      axios.defaults.headers["common"] = {
        Authorization: "Token " + token,
      };
    },
    [mutationTypes.REMOVE_TOKEN]() {
      Cookies.remove(stateKeys.TOKEN);
      axios.defaults.headers["common"] = {
        Authorization: "",
      };
    },
  },
};

store.registerModule(moduleName, authModule);
