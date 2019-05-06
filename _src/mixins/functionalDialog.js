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
