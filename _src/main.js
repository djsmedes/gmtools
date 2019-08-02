import Vue from "vue";
import VueNativeSock from "vue-native-websocket";
import App from "@/App";
import router from "@/router";
import store from "@/store";
import axios from "axios";
import { authMutations, authModuleName } from "@/auth";
import { stateKeys } from "@/auth/vuexKeys";
import { ModuleSocket } from "@/utils/websockets";
import { dialogPlugin, showSnackPlugin, vuetify } from "@/plugins";

Vue.config.productionTip = false;

Vue.use(dialogPlugin);
Vue.use(showSnackPlugin);

Vue.use(VueNativeSock, "//" + window.location.host + "/ws/combat/", {
  connectManually: true,
  format: "json",
  reconnection: true,
});

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

const vm = new Vue({
  vuetify,
  router,
  store,
  render: h => h(App),
}).$mount("#app");

Vue.prototype.$ws = new ModuleSocket(vm);

store.subscribe((mutation, state) => {
  switch (mutation.type) {
    case authMutations.SET_AUTH_USER:
      if (state[authModuleName][stateKeys.AUTH_USER]) {
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
