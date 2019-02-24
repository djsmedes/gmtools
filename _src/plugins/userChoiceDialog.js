import Confirm from "@/components/generic/UserChoiceDialog";

export class ButtonOption {
  constructor({ returnVal = false, text = "Cancel", attrs = {} } = {}) {
    this.returnVal = returnVal;
    this.text = text;
    this.attrs = {
      // add defaults here
      flat: true,
      ...attrs,
    };
  }
}

export function confirmPlugin(Vue) {
  const ConfirmComponent = Vue.extend(Confirm);

  Vue.prototype.$userChoice = function(title, body, buttonList) {
    const dialog = new ConfirmComponent({
      parent: this.$root,
      propsData: {
        title,
        body,
        buttonList,
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
