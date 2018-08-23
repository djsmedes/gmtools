import Vue from 'vue/dist/vue';
import TestComponent from './TestComponent.vue'

const app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  },
  components: {TestComponent}
});
