import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import VueNativeSock from "vue-native-websocket";
import App from "@/App";
import router from "@/router";
import store from "@/store";
import axios from "axios";
import { namespace, getterTypes } from "@/auth";
import { ModuleSocket } from "@/utils/websockets";

Vue.config.productionTip = false;

let ws_scheme = window.location.protocol === "https:" ? "wss" : "ws";
let url = ws_scheme + "://" + window.location.host + "/ws/combat/";

Vue.use(VueNativeSock, url, {
  format: "json",
  reconnection: true,
});

Vue.use(Vuetify, {
  theme: {
    primary: "#1976D2",
    secondary: "#424242",
    accent: "#82B1FF",
    error: "#FF5252",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FFC107",
  },
});

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.headers["common"] = {
  ...store.getters[namespace + "/" + getterTypes.AUTH_HEADER],
};

const vm = new Vue({
  router,
  store,
  render: h => h(App),
}).$mount("#app");

Vue.prototype.$ws = new ModuleSocket(vm);
