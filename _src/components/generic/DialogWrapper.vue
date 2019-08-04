<template>
  <v-dialog
    :value="visible"
    v-bind="rootAttrs"
    :persistent="persistent"
    v-on="rootListeners"
  >
    <v-card>
      <v-toolbar v-bind="toolbarAttrs">
        <v-toolbar-title class="flex-grow-1">{{ title }}</v-toolbar-title>
        <v-btn v-if="!persistent" icon @click="updateVisible(false)">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <slot></slot>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "DialogWrapper",
  inheritAttrs: false,
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      toolbarAttrs: {},
      rootAttrs: {},
      rootListeners: {},
      updateVisible: () => {},
      persistent: false,
    };
  },
  watch: {
    $attrs: {
      handler({
        dark = true,
        light = false,
        dense = true,
        color = "secondary",
        flat = true,
        persistent,
        ...otherProps
      }) {
        this.toolbarAttrs = {
          dark,
          light,
          dense,
          color,
          flat,
        };
        this.rootAttrs = {
          ...otherProps,
        };
        this.rootListeners = {
          input: this.updateVisible,
        };
        if (persistent !== undefined) {
          this.persistent = true;
          this.rootListeners.keydown = $event => {
            if (!this.persistent && $event.keyCode === 27) {
              this.updateVisible(false);
            }
          };
        }
      },
      immediate: true,
    },
    $listeners: {
      handler({ "update:visible": updateVisible = () => {} }) {
        this.updateVisible = updateVisible;
      },
      immediate: true,
    },
  },
};
</script>
