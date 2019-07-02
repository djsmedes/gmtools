import Vue from "vue";
import Vuex from "vuex";
import { epochNow } from "@/utils/time";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loadingCount: 0,
  },
  getters: {
    isLoading: state => state.loadingCount > 0,
    spotifyAuth: () => {
      let sessionAuth = sessionStorage.getItem("spotifyAuth");
      if (!sessionAuth) {
        return {};
      }
      let obj = JSON.parse(sessionAuth);
      if (epochNow() > obj.expires_at) {
        return {};
      }
      return obj;
    },
  },
  actions: {},
  mutations: {
    needLoading: state => (state.loadingCount = state.loadingCount + 1),
    doneLoading: state => (state.loadingCount = state.loadingCount - 1),
    setSpotifyAuth: (state, payload) => {
      payload.expires_at = epochNow() + Number(payload.expires_in);
      sessionStorage.setItem("spotifyAuth", JSON.stringify(payload));
    },
  },
});
