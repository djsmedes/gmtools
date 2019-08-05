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
    id: {
      type: String,
      required: true,
    },
  },
  apollo: {
    creatureprop: {
      query: gql`
        query BigQuery($id: String!) {
          creatureprop(id: $id) {
            id
            title
          }
        }
      `,
      variables() {
        return { id: this.id };
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
