import Vue from "vue";
import Vuetify, { VLayout } from "vuetify/lib";
import "vuetify/src/stylus/app.styl";
import VueNativeSock from "vue-native-websocket";
import App from "@/App";
import router from "@/router";
import store from "@/store";
import axios from "axios";
import { authGetters, authMutations } from "@/auth";
import { stateKeys } from "@/auth/vuexKeys";
import { ModuleSocket } from "@/utils/websockets";
import { dialogPlugin } from "@/plugins/userChoiceDialog";
import { showSnackPlugin } from "@/plugins/showSnack";

Vue.config.productionTip = false;
Vue.use(Vuetify, {
  components: { VLayout },
  theme: {
    primary: "#1976D2",
    edit: "#1976D2",
    save: "#1976D2",
    cancel: "#424242",
    delete: "#FF5252",
    secondary: "#424242",
    accent: "#82B1FF",
    error: "#FF5252",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FFC107",
  },
});

Vue.use(dialogPlugin);
Vue.use(showSnackPlugin);

Vue.use(VueNativeSock, "//" + window.location.host + "/ws/combat/", {
  connectManually: true,
  format: "json",
  reconnection: true,
});

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.headers.common = {
  ...axios.defaults.headers.common,
  ...store.getters[authGetters.AUTH_HEADER],
};

const vm = new Vue({
  router,
  store,
  render: h => h(App),
}).$mount("#app");

Vue.prototype.$ws = new ModuleSocket(vm);

store.subscribe((mutation, state) => {
  switch (mutation.type) {
    case authMutations.SET_AUTH_USER:
      if (state[stateKeys.AUTH_USER]) {
        vm.$ws.initialize();
      } else {
        vm.$ws.terminate();
      }
      break;
    case authMutations.CLEAR_AUTH_USER:
      vm.$ws.terminate();
      break;
  }
});
