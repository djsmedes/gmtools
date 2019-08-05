<template>
  <functional-dialog-wrapper
    v-bind="dialogAttrs"
    title="Test"
    v-on="dialogListeners"
  >
    <pre>
      {{ JSON.stringify(creatureprop, null, 2) }}
    </pre>
  </functional-dialog-wrapper>
</template>

<script>
import gql from "graphql-tag";
import { functionalDialogMixin } from "@/mixins";
import FunctionalDialogWrapper from "@/components/generic/FunctionalDialogWrapper";

export default {
  name: "StatblockTestDialog",
  components: { FunctionalDialogWrapper },
  mixins: [functionalDialogMixin],
  props: {
    uuid: {
      type: String,
      required: true,
    },
  },
  apollo: {
    creatureprop: {
      query: gql`
        query BigQuery($uuid: String!) {
          creatureprop(uuid: $uuid) {
            uuid
            title
          }
        }
      `,
      variables() {
        return { uuid: this.uuid };
      },
    },
  },
  data() {
    return {
      creatureprop: {},
    };
  },
};
</script>
