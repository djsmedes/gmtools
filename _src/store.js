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
      let spotifyAuth = localStorage.getItem("spotifyAuth") || "{}";
      return JSON.parse(spotifyAuth);
    },
    spotifyAuthUrl: () => {
      let base = "https://accounts.spotify.com/authorize";
      let query_params = {
        client_id: "4c7dbd05cc7548beb32c02c5ba65994e",
        response_type: "code",
        redirect_uri: "http://localhost:8080/spotify-response/",
        state: "this is state",
        scope: [
          "user-read-playback-state",
          "user-read-currently-playing",
          "user-modify-playback-state",
          "playlist-read-collaborative",
          "playlist-read-private",
        ].join(" "),
        show_dialog: true,
      };
      let toBeEncoded = Object.entries(query_params).reduce(
        (accumulator, [key, val], index) => {
          return accumulator + (index ? "&" : "?") + key + "=" + val;
        },
        base
      );
      return encodeURI(toBeEncoded);
    },
  },
  actions: {},
  mutations: {
    needLoading: state => (state.loadingCount = state.loadingCount + 1),
    doneLoading: state => (state.loadingCount = state.loadingCount - 1),
    setSpotifyAuth: (state, payload) => {
      let oldAuth = localStorage.getItem("spotifyAuth") || "{}";
      let newAuth = {
        ...JSON.parse(oldAuth),
        ...payload,
        expires_at: epochNow() + Number(payload.expires_in),
      };
      localStorage.setItem("spotifyAuth", JSON.stringify(newAuth));
    },
    clearSpotifyAuth: () => {
      localStorage.removeItem("spotifyAuth");
    },
  },
});
