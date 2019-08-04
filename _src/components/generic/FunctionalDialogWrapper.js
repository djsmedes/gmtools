import {
  VDialog,
  VCard,
  VToolbar,
  VToolbarTitle,
  VBtn,
  VIcon,
} from "vuetify/lib";

export default {
  name: "FunctionalDialogWrapper",
  functional: true,
  render: (createElement, context) => {
    let {
      dark = true,
      light = false,
      dense = true,
      color = "secondary",
      title = "",
      visible = false,
      persistent,
      ...otherProps
    } = context.props;

    let { "update:visible": updateVisible = () => {} } = context.listeners;

    let toolbarChildren = [
      createElement(
        VToolbarTitle,
        {
          class: { "flex-grow-1": true },
        },
        [title]
      ),
    ];

    if (persistent === undefined) {
      toolbarChildren.push(
        createElement(
          VBtn,
          {
            attrs: { icon: true },
            on: {
              click: () => updateVisible(false),
            },
          },
          [createElement(VIcon, "close")]
        )
      );
    }

    let toolbar = createElement(
      VToolbar,
      {
        attrs: {
          dark,
          light,
          dense,
          color,
          flat: true,
        },
      },
      toolbarChildren
    );

    let card = createElement(VCard, {}, [toolbar, ...context.slots().default]);

    let dialogListeners = {
      input: updateVisible,
    };

    if (persistent === undefined) {
      dialogListeners.keydown = $event => {
        if ($event.keyCode === 27) {
          updateVisible(false);
        }
      };
    }

    return createElement(
      VDialog,
      {
        attrs: {
          value: visible,
          persistent,
          ...otherProps,
        },
        on: dialogListeners,
      },
      [card]
    );
  },
};
