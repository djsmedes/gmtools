<template>
  <v-dialog v-model="dialog" v-bind="sizeAttrs" @keydown.esc="close">
    <v-card>
      <v-toolbar :dark="dark" :light="light" :dense="dense" :color="color" flat>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <slot></slot>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "FunctionalDialogWrapper",
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    sizeAttrs: {
      type: Object,
      default: () => ({}),
    },
    dark: {
      type: Boolean,
      default: true,
    },
    light: {
      type: Boolean,
      default: false,
    },
    dense: {
      type: Boolean,
      default: true,
    },
    color: {
      type: String,
      default: "secondary",
    },
    title: {
      type: String,
      default: "",
    },
  },
  computed: {
    dialog: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      },
    },
  },
  methods: {
    close() {
      this.$emit("close", null);
    },
  },
};
</script>
