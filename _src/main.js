import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap'
import axios from 'axios'

Vue.config.productionTip = false;

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
