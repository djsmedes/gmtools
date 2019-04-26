import Vue from "vue";
import Vuex from "vuex";
import auth from "@/auth";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    ...auth.store.state,
    loadingCount: 0,
    lastReplyId: null,
  },
  getters: {
    ...auth.store.getters,
    isLoading: state => state.loadingCount > 0,
  },
  actions: {
    ...auth.store.actions,
  },
  mutations: {
    ...auth.store.mutations,
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
});
