<template>
  <div>
    <v-switch v-model="$vuetify.theme.dark" label="Use dark mode"></v-switch>
    <pre>
      {{ JSON.stringify(creatureprops, null, 2) }}
    </pre>
    <v-btn @click="testCache">test cache</v-btn>
  </div>
</template>

<script>
import gql from "graphql-tag";
import StatblockTestDialog from "@/components/statblocks/StatblockTestDialog";

export default {
  name: "AuthAccountOverview",
  apollo: {
    statblocks: {
      query: gql`
        query {
          statblockSet {
            edges {
              node {
                id
                name
                proficiency
              }
            }
          }
        }
      `,
      update: data => data.statblockSet.edges.map(edge => edge.node),
    },
    creatureprops: {
      query: gql`
        query {
          creaturepropSet {
            uuid
            title
          }
        }
      `,
      update: data => data.creaturepropSet,
    },
  },
  data() {
    return {
      statblocks: [],
      creatureprops: [],
    };
  },
  methods: {
    testCache() {
      this.$dialog(StatblockTestDialog, {
        uuid: this.creatureprops[0].uuid,
      });
    },
  },
};
</script>
