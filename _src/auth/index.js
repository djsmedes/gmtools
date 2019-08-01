import Vue from "vue";
import { remove as removeCookie } from "js-cookie";
import axios from "axios";
import { generateUrl2 as generateUrl } from "@/utils/urls";
import { actionTypes, stateKeys, mutationTypes, getterTypes } from "./vuexKeys";
import store from "@/store";
import fromPairs from "lodash/fromPairs";
import { User, CampaignList, Campaign } from "@/models";

const AUTH_TOKEN_NAME = "authToken";
const moduleName = "auth";
export const authModuleName = moduleName;

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
    [getterTypes.AUTH_USER_UUID]: state => {
      return state[stateKeys.AUTH_USER];
    },
    [getterTypes.AUTH_USER]: (state, getters) => {
      let user = new User({ uuid: getters[getterTypes.AUTH_USER_UUID] });
      user.reset();
      return user;
    },
    [getterTypes.CURRENT_CAMPAIGN_UUID]: state => {
      return state[stateKeys.CURRENT_CAMPAIGN];
    },
    [getterTypes.CURRENT_CAMPAIGN]: (state, getters) => {
      let campaign = new Campaign({
        uuid: getters[getterTypes.CURRENT_CAMPAIGN_UUID],
      });
      campaign.reset();
      return campaign;
    },
  },
  actions: {
    [actionTypes.LOGIN]: async ({ commit, dispatch }, { email, password }) => {
      try {
        await axios.post(generateUrl("token-auth"), {
          username: email,
          password: password,
        });
        await dispatch(actionTypes.GET_USER);
      } catch (err) {
        if (
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
    [actionTypes.GET_USER]: async ({ commit }) => {
      try {
        let { data } = await axios.get(generateUrl("request-user"));
        let { user, campaigns } = data;
        if (!user.uuid) {
          commit(mutationTypes.CLEAR_AUTH_USER);
          commit(mutationTypes.REMOVE_TOKEN);
        } else {
          commit(mutationTypes.SET_AUTH_USER, user);
          commit(mutationTypes.SET_CURRENT_CAMPAIGN, user.current_campaign);
        }
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
    [actionTypes.LOGOUT]: ({ commit }) => {
      commit(mutationTypes.REMOVE_TOKEN);
      window.location.reload();
    },
    [actionTypes.SIGNUP]: async (
      { dispatch },
      { email, password1, password2 }
    ) => {
      try {
        await axios.post(generateUrl("signup"), {
          email,
          password1,
          password2,
        });
        await dispatch(actionTypes.GET_USER);
      } catch (err) {
        throw err;
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
    [mutationTypes.REMOVE_TOKEN]() {
      removeCookie(AUTH_TOKEN_NAME);
    },
  },
};

store.registerModule(moduleName, authModule);
