import Vue from "vue";
import App from "@/App";
import router from "@/router";
import store from "@/store";
import "bootstrap";
import axios from "axios";
import { namespace, getterTypes } from "@/auth";

Vue.config.productionTip = false;

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

let sockUrl = "ws://" + window.location.host + "/ws/combat/";
console.log(sockUrl);
let sock = new WebSocket(sockUrl);

sock.onmessage = e => {
  const data = JSON.parse(e.data);
  let message = data["message"];
  console.log(message);
};

sock.onopen = () => {
  sock.send(JSON.stringify({ message: "this is the message" }));
};

sock.onclose = e => {
  console.error("Socket closed.");
};
