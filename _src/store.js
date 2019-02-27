import Vue from "vue";
import Vuex from "vuex";
import campaign from "@/models/campaign";
import combatant from "@/models/combatant";
import encounter from "@/models/encounter";
import gmscreentab from "@/models/gmscreentab";
import user from "@/models/user";
import auth from "@/auth";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loadingCount: 0,
    lastReplyId: null,
  },
  getters: {
    isLoading: state => state.loadingCount > 0,
  },
  actions: {},
  mutations: {
    needLoading: state => (state.loadingCount = state.loadingCount + 1),
    doneLoading: state => (state.loadingCount = state.loadingCount - 1),
    setLastReply: (state, value) => Vue.set(state, "lastReplyId", value),
    // eslint-disable-next-line
    SOCKET_ONOPEN: state => {},
    // eslint-disable-next-line
    SOCKET_ONCLOSE: state => {},
    SOCKET_ONERROR: (state, wsEvent) => {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line
        console.warn(wsEvent);
      }
    },
    // eslint-disable-next-line
    SOCKET_ONMESSAGE: state => {},
    // eslint-disable-next-line
    SOCKET_RECONNECT: state => {},
    // eslint-disable-next-line
    SOCKET_RECONNECT_ERROR: state => {},
  },
  modules: {
    [auth.namespace]: auth.store,
    [campaign.namespace]: campaign.store,
    [combatant.namespace]: combatant.store,
    [encounter.namespace]: encounter.store,
    [gmscreentab.namespace]: gmscreentab.store,
    [user.namespace]: user.store,
  },
});
