import Vue from "vue";
import App from "@/App";
import router from "@/router";
import store from "@/store";
import "bootstrap";
import axios from "axios";
import { getterTypes } from "./auth";

Vue.config.productionTip = false;

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.headers["common"] = {
  ...store.getters[getterTypes.AUTH_HEADER]
};

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
