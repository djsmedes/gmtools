<template>
  <v-container fluid v-html="compiledMarkdown">
  </v-container>
</template>

<script>
import marked from "marked";

export default {
  name: "GMScreenTab",
  props: {
    content: {
      type: String,
      default: ""
    }
  },
  computed: {
    compiledMarkdown() {
      return marked(this.content, { sanitize: true });
    }
  }
};
</script>

<style scoped>
</style>
