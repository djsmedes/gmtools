import Confirm from "@/components/generic/UserChoiceDialog";

export class ButtonOption {
  constructor({ returnVal = false, text = "Cancel", attrs = {} } = {}) {
    this.returnVal = returnVal;
    this.text = text;
    this.attrs = {
      // add defaults here
      text: true,
      ...attrs,
    };
  }
}

function asyncDialog(ComponentConstructor, componentProps) {
  const dialog = new ComponentConstructor({
    parent: this.$root,
    propsData: componentProps,
  });
  dialog.$mount();
  document.getElementById("functionalDialog").appendChild(dialog.$el);
  dialog.open();

  return new Promise(resolve => {
    dialog.$once("close", returnVal => {
      // timeout to allow the close animation to play before we rip this out of the DOM and burn it
      setTimeout(() => {
        try {
          document.getElementById("functionalDialog").removeChild(dialog.$el);
          // eslint-disable-next-line no-empty
        } catch {}
        dialog.$destroy();
        resolve(returnVal);
      }, 100);
    });
  });
}

export function dialogPlugin(Vue) {
  const ConfirmComponent = Vue.extend(Confirm);

  Vue.prototype.$userChoice = function(title, body, buttonList) {
    return asyncDialog.bind(this)(ConfirmComponent, {
      title,
      body,
      buttonList,
    });
  };

  Vue.prototype.$dialog = function(component, componentProps) {
    return asyncDialog.bind(this)(Vue.extend(component), componentProps);
  };
}
