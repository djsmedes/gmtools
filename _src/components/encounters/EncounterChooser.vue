<template>
  <v-card>
    <v-card-title>
      <h4 class="headline">Change Encounter</h4>
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
      <v-data-iterator></v-data-iterator>
    </v-card-text>
    <v-card-actions>
      <v-btn flat v-if="saveFunc" @click="save">Save</v-btn>
      <v-btn flat v-if="cancelFunc" @click="cancelFunc">Cancel</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import encounter, { Encounter } from "@/models/encounter";
import combatant from "@/models/combatant";
import auth from "@/auth";

export default {
  name: "EncounterChooser",
  props: {
    saveFunc: {
      type: Function,
      default: null
    },
    cancelFunc: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      selectedEncounter: null,
      activeEncSearch: null
    };
  },
  watch: {
    activeEncounter: {
      handler(newVal) {
        this.selectedEncounter = new Encounter(newVal);
      },
      immediate: true
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
    activeEncounter() {
      return this.getEncounter(this.currentCampaign.active_encounter);
    }
  },
  methods: {
    save() {
      this.saveFunc(this.selectedEncounter);
    }
  }
};
</script>
