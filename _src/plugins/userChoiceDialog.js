import Confirm from "@/components/generic/UserChoiceDialog";

export function confirmPlugin(Vue) {
  const ConfirmComponent = Vue.extend(Confirm);

  Vue.prototype.$userChoice = function(message, title, params = {}) {
    const dialog = new ConfirmComponent({
      parent: this.$root,
      propsData: {
        message,
        title,
        params,
      },
    });
    dialog.$mount();
    document.body.appendChild(dialog.$el);
    dialog.open();

    return new Promise(resolve => {
      dialog.$once("close", choice => {
        document.body.removeChild(dialog.$el);
        resolve(choice);
      });
    });
  };
}
