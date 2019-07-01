import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loadingCount: 0,
    spotifyAuth: {},
  },
  getters: {
    isLoading: state => state.loadingCount > 0,
    spotifyAuth: state => state.spotifyAuth,
  },
  actions: {},
  mutations: {
    needLoading: state => (state.loadingCount = state.loadingCount + 1),
    doneLoading: state => (state.loadingCount = state.loadingCount - 1),
    setSpotifyAuth: (state, payload) => (state.spotifyAuth = payload),
  },
});
