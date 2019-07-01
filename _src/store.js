import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loadingCount: 0,
  },
  getters: {
    isLoading: state => state.loadingCount > 0,
    spotifyAuth: state => {
      return JSON.parse(sessionStorage.getItem("spotifyAuth"));
    },
  },
  actions: {},
  mutations: {
    needLoading: state => (state.loadingCount = state.loadingCount + 1),
    doneLoading: state => (state.loadingCount = state.loadingCount - 1),
    setSpotifyAuth: (state, payload) => {
      sessionStorage.setItem("spotifyAuth", JSON.stringify(payload));
    },
  },
});
