<template>
  <div>
    <v-switch v-model="$vuetify.theme.dark" label="Use dark mode"></v-switch>
    <div v-for="combatant in combatants" :key="combatant.id">
      <p>
        <a @click="singleCombatantId = combatant.id">{{ combatant.id }}</a>
      </p>
      <p>{{ combatant.name }}</p>
      <p>{{ combatant.initiative }}</p>
    </div>
    <h4>Single Combatant:</h4>
    <div v-if="combatant">
      <p>{{ combatant.id }}</p>
      <p>{{ combatant.name }}</p>
      <p>{{ combatant.initiative }}</p>
    </div>
    <v-btn @click="showMore(true)"><v-icon>mdi-chevron-left</v-icon></v-btn>
    <v-btn @click="showMore(false)"><v-icon>mdi-chevron-right</v-icon></v-btn>
  </div>
</template>

<script>
import gql from "graphql-tag";
import cloneDeep from "lodash/cloneDeep";
import findIndex from "lodash/findIndex";

const first = 1;

function mergeInEdges(oldEdges, newEdges, previous = false) {
  oldEdges = cloneDeep(oldEdges);
  newEdges = cloneDeep(newEdges);
  for (let oldEdge of oldEdges) {
    let idx = findIndex(newEdges, edge => edge.node.uuid === oldEdge.node.uuid);
    if (idx !== -1) {
      oldEdge = newEdges.splice(idx, 1);
    }
  }
  return previous ? [...newEdges, ...oldEdges] : [...oldEdges, ...newEdges];
}

export default {
  name: "AuthAccountOverview",
  apollo: {
    combatantSet: {
      query: gql`
        query combatantPage(
          $first: Int
          $last: Int
          $after: String
          $before: String
        ) {
          combatantSet(
            first: $first
            after: $after
            last: $last
            before: $before
          ) {
            edges {
              node {
                id
                uuid
                name
                initiative
                encounter {
                  uuid
                }
                campaign {
                  name
                }
              }
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
          }
        }
      `,
      variables: {
        first: first,
        after: null,
      },
    },
    combatant: {
      query: gql`
        query combatant($id: ID!) {
          combatant(id: $id) {
            id
            uuid
            name
            initiative
          }
        }
      `,
      skip() {
        return !this.singleCombatantId;
      },
      variables() {
        return {
          id: this.singleCombatantId,
        };
      },
    },
  },
  data() {
    return {
      first: first,
      after: null,
      singleCombatantId: "",
    };
  },
  computed: {
    combatants() {
      return this.combatantSet
        ? this.combatantSet.edges.map(edge => edge.node)
        : [];
    },
  },
  methods: {
    showMore(previous = false) {
      this.$apollo.queries.combatantSet.fetchMore({
        // New variables
        variables: previous
          ? {
              last: this.first,
              before: this.combatantSet.pageInfo.startCursor,
              first: undefined,
              after: undefined,
            }
          : {
              first: this.first,
              after: this.combatantSet.pageInfo.endCursor,
            },
        // Transform the previous result with new data
        updateQuery: (priorResult, { fetchMoreResult: thisResult }) => {
          return {
            combatantSet: {
              edges: mergeInEdges(
                priorResult.combatantSet.edges,
                thisResult.combatantSet.edges,
                previous
              ),
              pageInfo: thisResult.combatantSet.pageInfo,
            },
          };
        },
      });
    },
  },
};
</script>
