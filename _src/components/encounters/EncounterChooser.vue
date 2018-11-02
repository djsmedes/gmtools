<template>
  <v-card>
    <v-card-title>
      <h4 class="title">Change Encounter</h4>
    </v-card-title>
    <v-card-text>
    <v-form @submit.prevent>
      <v-select
          label="Active encounter"
          :items="encounters"
          item-value="uuid"
          item-text="name"
          :menu-props="{ offsetY: true }"
          returnObject
          v-model="selectedEncounter">
      </v-select>
    </v-form>
      </v-card-text>
    <v-card-actions>
      <slot name="actions" :selectedEncounter="selectedEncounter"></slot>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import encounter from "@/models/encounter";
import auth from "@/auth";

export default {
  name: "EncounterChooser",
  props: {
    reset: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedEncounter: null
    };
  },
  watch: {
    reset(newVal) {
      if (newVal) this.selectedEncounter = this.currentEncounter;
    }
  },
  computed: {
    ...mapGetters(encounter.namespace, {
      encounters: encounter.getterTypes.LIST,
      getEncounter: encounter.getterTypes.BY_ID
    }),
    ...mapGetters(auth.namespace, {
      currentCampaign: auth.getterTypes.CURRENT_CAMPAIGN
    }),
    currentEncounter() {
      return this.getEncounter(this.currentCampaign.active_encounter);
    }
  }
};
</script>
