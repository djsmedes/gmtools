<template>
  <v-card>
    <v-card-title>
      <h4 class="title">Change Encounter</h4>
      <v-spacer></v-spacer>
      <v-btn text @click="showCompleted = !showCompleted">
        Completed
        <v-icon v-if="showCompleted" right>visibility</v-icon>
        <v-icon v-else right>visibility_off</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-form @submit.prevent>
        <v-select
          :items="
            showCompleted
              ? [...encounters.models, ...completedEncounters.models]
              : encounters.models
          "
          :menu-props="{ offsetY: true }"
          v-model="selectedEncounter"
          label="Active encounter"
          item-value="uuid"
          item-text="name"
          return-object
        >
          <template #item="{ item }">
            {{ item.name }}{{ item.completion_date ? " (completed)" : "" }}
          </template>
        </v-select>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <slot :selectedEncounter="selectedEncounter" name="actions"></slot>
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
  computed: {
    currentEncounter() {
      let encounter = new Encounter({
        uuid: getCurrentCampaign().active_encounter,
      });
      encounter.fetch();
      return encounter;
    },
  },
  watch: {
    showCompleted(val) {
      if (!this.lazyLoadedCompleted && val) {
        this.completedEncounters.fetch();
        this.lazyLoadedCompleted = true;
      }
    },
  },
  created() {
    this.encounters.fetch();
  },
};
</script>
