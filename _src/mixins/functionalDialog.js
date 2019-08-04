export const functionalDialogMixin = {
  data() {
    return {
      dialog: false,
    };
  },
  watch: {
    dialog(newVal) {
      if (!newVal) {
        this.$emit("close", null);
      }
    },
  },
  computed: {
    sizeAttrs() {
      let attrs = {};
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          attrs.fullscreen = true;
          break;
        case "sm":
          attrs["max-width"] = "400px";
          break;
        case "md":
          attrs["max-width"] = "500px";
          break;
        case "lg":
          attrs["max-width"] = "600px";
          break;
        case "xl":
          attrs["max-width"] = "800px";
          break;
      }
      return attrs;
    },
    dialogAttrs() {
      return {
        ...this.sizeAttrs,
        visible: this.dialog,
      };
    },
    dialogListeners() {
      return {
        "update:visible": $event => (this.dialog = $event),
      };
    },
  },
  methods: {
    open() {
      this.dialog = true;
    },
    close(returnVal) {
      this.dialog = false;
      this.$emit("close", returnVal);
    },
  },
};

export default functionalDialogMixin;
