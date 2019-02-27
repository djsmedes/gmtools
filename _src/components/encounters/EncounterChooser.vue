<template>
  <v-card>
    <v-card-title>
      <h4 class="title">Change Encounter</h4>
      <v-spacer></v-spacer>
      <v-btn flat @click="showCompleted = !showCompleted">
        Completed
        <v-icon v-if="showCompleted" right>visibility</v-icon>
        <v-icon v-else right>visibility_off</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-form @submit.prevent>
        <v-select
          label="Active encounter"
          :items="
            showCompleted ? [...encounters, ...completedEncounters] : encounters
          "
          item-value="uuid"
          item-text="name"
          :menu-props="{ offsetY: true }"
          returnObject
          v-model="selectedEncounter"
        >
          <template slot="item" slot-scope="{ item }">
            {{ item.name }}{{ item.completion_date ? " (completed)" : "" }}
          </template>
        </v-select>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <slot name="actions" :selectedEncounter="selectedEncounter"></slot>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import encounter from "@/models/encounter";
import auth from "@/auth";

export default {
  name: "EncounterChooser",
  props: {
    reset: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedEncounter: null,
      showCompleted: false,
      lazyLoadedCompleted: false,
    };
  },
  watch: {
    reset(newVal) {
      if (newVal) this.selectedEncounter = this.currentEncounter;
    },
    showCompleted(val) {
      if (!this.lazyLoadedCompleted && val) {
        this.loadEncountersQuery({ completed_after: "0001-01-01" });
        this.lazyLoadedCompleted = true;
      }
    },
  },
  computed: {
    ...mapGetters(encounter.namespace, {
      encounters: encounter.getterTypes.LIST,
      completedEncounters: encounter.getterTypes.LIST_COMPLETED,
      getEncounter: encounter.getterTypes.BY_ID,
    }),
    ...mapGetters(auth.namespace, {
      currentCampaign: auth.getterTypes.CURRENT_CAMPAIGN,
    }),
    currentEncounter() {
      return this.getEncounter(this.currentCampaign.active_encounter);
    },
  },
  methods: {
    ...mapActions(encounter.namespace, {
      loadEncountersQuery: encounter.actionTypes.QUERY_LIST,
    }),
  },
};
</script>
