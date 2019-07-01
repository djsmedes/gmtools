import Snack from "@/components/generic/Snack";

export function showSnackPlugin(Vue) {
  const SnackComponent = Vue.extend(Snack);

  Vue.prototype.$showSnack = function(message, attrs = {}) {
    const snack = new SnackComponent({
      parent: this.$root,
      propsData: {
        message,
        snackAttrs: attrs,
      },
    });
    snack.$mount();
    // has to be under "app" to get default styles
    document.getElementById("app").appendChild(snack.$el);
    snack.open();

    return new Promise(resolve => {
      snack.$once("close", returnVal => {
        snack.$destroy();
        resolve(returnVal);
      });
    });
  };
}
