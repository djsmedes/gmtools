import Vue from "vue";
import VueNativeSock from "vue-native-websocket";
import App from "@/App";
import router from "@/router";
import store from "@/store";
import "bootstrap";
import axios from "axios";
import { namespace, getterTypes } from "@/auth";

Vue.config.productionTip = false;
Vue.use(VueNativeSock, "not-implemented", {
  connectManually: true
});

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.headers["common"] = {
  ...store.getters[namespace + "/" + getterTypes.AUTH_HEADER]
};

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
