import Vue from 'vue/dist/vue';

function component() {
  let element = document.createElement('div');
  element.id = 'app';
  return element;
}

document.body.appendChild(component());

const app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  },
  template: '<div>{{ message }}</div>'
});
