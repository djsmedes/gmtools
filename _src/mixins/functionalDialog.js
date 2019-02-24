export default {
  data() {
    return {
      dialog: false,
    };
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
