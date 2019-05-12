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
            showCompleted
              ? [...encounters.models, ...completedEncounters.models]
              : encounters.models
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
import { Encounter, EncounterList, getCurrentCampaign } from "@/models";

export default {
  name: "EncounterChooser",
  data() {
    return {
      selectedEncounter: null,
      showCompleted: false,
      lazyLoadedCompleted: false,
      encounters: new EncounterList(),
      completedEncounters: new EncounterList([], {
        storeFilter: {
          completed_after: "0001-01-01",
        },
      }),
    };
  },
  watch: {
    showCompleted(val) {
      if (!this.lazyLoadedCompleted && val) {
        this.completedEncounters.fetch();
        this.lazyLoadedCompleted = true;
      }
    },
  },
  computed: {
    currentEncounter() {
      let encounter = new Encounter({
        uuid: getCurrentCampaign().active_encounter,
      });
      encounter.fetch();
      return encounter;
    },
  },
  created() {
    this.encounters.fetch();
  },
};
</script>
