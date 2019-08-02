<template>
  <v-container fluid class="gm-screen" v-html="compiledMarkdown"> </v-container>
</template>

<script>
import marked from "marked";
import DOMPurify from "dompurify";

export default {
  name: "GMScreenTab",
  props: {
    content: {
      type: String,
      default: "",
    },
  },
  computed: {
    compiledMarkdown() {
      return DOMPurify.sanitize(marked(this.content));
    },
  },
};
</script>

<style lang="scss">
.gm-screen {
  p,
  li,
  table {
    page-break-inside: avoid;
    break-inside: avoid;
    /* todo - figure out why break-before doesn't work */
    break-before: avoid;
  }
  p + p {
    margin-top: -1.1em;
    text-indent: 2em;
  }
  tbody tr:nth-child(odd) {
    background-color: #bbbbbb;
  }
  td {
    padding: 0.1em 0.25em;
  }
  table {
    width: 100%;
    margin-bottom: 2em;
  }

  @media (min-width: 960px) {
    column-count: 2;
  }
  @media (min-width: 1264px) {
    column-count: 3;
  }
  @media (min-width: 1904px) {
    column-count: 4;
  }
}
</style>
