<template>
  <div>
    <v-card>
      <v-card-title>
        Combatants
        <v-spacer></v-spacer>
        <v-text-field
          :value="searchInput"
          hide-details
          placeholder="Search"
          append-icon="mdi-magnify"
          @input="updateSearch"
        >
        </v-text-field>
        <v-spacer></v-spacer>
        <v-btn text color="edit">
          <v-icon left>mdi-plus-circle-outline</v-icon>
          Create new
        </v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="combatants"
        :items-per-page.sync="itemsPerPage"
        :loading="$apollo.queries.combatantSet.loading"
        :server-items-length="combatantSet && combatantSet.totalCount"
        hide-default-footer
        @click:row="goToCombatantDetail"
      >
        <template #footer>
          <div class="d-flex">
            <v-spacer></v-spacer>
            <v-btn :disabled="!canPrevPage" text icon @click="showMore(true)">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <div class="d-inline-flex align-baseline">
              Rows per page:
              <v-select
                v-model="itemsPerPage"
                :items="[10, 25, 100]"
                solo
                flat
                hide-details
                style="max-width: 80px"
              ></v-select>
            </div>
            <v-btn :disabled="!canNextPage" text icon @click="showMore()">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import gql from "graphql-tag";
import { authUserMixin } from "@/mixins";
import debounce from "lodash/debounce";

export default {
  name: "CombatantList",
  mixins: [authUserMixin],
  apollo: {
    combatantSet: {
      query: gql`
        query combatantPage(
          $first: Int
          $last: Int
          $after: String
          $before: String
          $contains: String
        ) {
          combatantSet(
            first: $first
            after: $after
            last: $last
            before: $before
            name_Icontains: $contains
          ) {
            edges {
              node {
                uuid
                name
              }
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
            totalCount
          }
        }
      `,
      variables() {
        return {
          first: this.itemsPerPage,
          after: null,
          contains: this.searchInput,
        };
      },
    },
  },
  data() {
    return {
      searchInput: null,
      itemsPerPage: 10,
      headers: [
        {
          text: "Name",
          align: "left",
          sortable: false,
          value: "name",
        },
      ],
      hasNextPage: null,
      hasPrevPage: null,
    };
  },
  computed: {
    combatants() {
      return this.combatantSet
        ? this.combatantSet.edges.map(edge => edge.node)
        : [];
    },
    canNextPage() {
      if (this.hasNextPage !== null) {
        return this.hasNextPage;
      } else if (this.combatantSet) {
        return this.combatantSet.pageInfo.hasNextPage;
      } else {
        return false;
      }
    },
    canPrevPage() {
      if (this.hasPrevPage !== null) {
        return this.hasPrevPage;
      } else if (this.combatantSet) {
        return this.combatantSet.pageInfo.hasPreviousPage;
      } else {
        return false;
      }
    },
  },
  methods: {
    async showMore(previous = false) {
      await this.$apollo.queries.combatantSet.fetchMore({
        // New variables
        variables: previous
          ? {
              last: this.itemsPerPage,
              before: this.combatantSet.pageInfo.startCursor,
            }
          : {
              first: this.itemsPerPage,
              after: this.combatantSet.pageInfo.endCursor,
            },
        updateQuery: (priorResult, { fetchMoreResult }) => fetchMoreResult,
      });
      if (previous) {
        this.hasPrevPage = null;
        this.hasNextPage = true;
      } else {
        this.hasPrevPage = true;
        this.hasNextPage = null;
      }
    },
    goToCombatantDetail(combatant) {
      this.$router.push({
        name: this.$routeNames.COMBATANT,
        params: { uuid: combatant.uuid },
      });
    },
    updateSearch: debounce(function(newTerm) {
      if (newTerm && newTerm.length > 2) {
        this.searchInput = newTerm;
      } else {
        this.searchInput = null;
      }
    }, 300),
  },
};
</script>
