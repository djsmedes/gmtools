<template>
  <v-snackbar v-model="snack" v-bind="snackAttrs">
    {{ message }}
    <v-btn icon flat @click="close(false)" v-if="!buttonList.length">
      <v-icon>close</v-icon>
    </v-btn>
    <v-btn
      v-for="(button, index) in buttonList"
      :key="index"
      v-bind="button.attrs"
      @click="close(button.returnVal)"
    >
      <template v-if="button.text">
        {{ button.text }}
      </template>
      <v-icon v-else-if="button.icon">{{ button.icon }}</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  name: "Snack",
  props: {
    message: {
      type: String,
      required: true,
    },
    snackAttrs: {
      type: Object,
      default: () => ({ bottom: true }),
    },
    buttonList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      snack: false,
      returnValue: null,
    };
  },
  watch: {
    snack(val) {
      if (!val) {
        this.$nextTick(() => this.$emit("close", this.returnValue));
      }
    },
  },
  methods: {
    open() {
      this.snack = true;
    },
    close(returnValue) {
      this.returnValue = returnValue;
      this.snack = false;
    },
  },
};
</script>
