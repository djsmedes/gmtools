<template>
  <v-container fluid class="pa-0" grid-list-md>
    <v-layout column>

      <v-flex>
        <v-card>
          <v-card-title>
            <h4 class="headline">Change Encounter</h4>
          </v-card-title>
          <v-container fluid grid-list-md>
            <v-form @submit.prevent>
              <v-layout row wrap>
                <v-flex xs6 sm4 md3>
                  <v-select
                      label="Active encounter"
                      :items="encounters"
                      item-value="uuid"
                      item-text="name"
                      :menu-props="{ offsetY: true }"
                      returnObject
                      v-model="selectedEncounter">
                  </v-select>
                </v-flex>
              </v-layout>
            </v-form>
          </v-container>
          <v-card-actions>
            <v-btn flat v-if="saveFunc" @click="save">Save & go back</v-btn>
            <v-btn flat v-if="cancelFunc" @click="cancel">Go back</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>

      <v-flex>
        <encounter-detail :encounter-uuid="selectedEncounter.uuid"></encounter-detail>
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import encounter, { Encounter } from "@/models/encounter";
import auth from "@/auth";
import EncounterDetail from "@/components/encounters/EncounterDetail";
import { routeNames } from "@/router";

export default {
  name: "EncounterChooser",
  components: { EncounterDetail },
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
      selectedEncounter: null
    };
  },
  watch: {
    activeEncounter: {
      handler(newVal) {
        this.selectedEncounter = new Encounter(newVal);
      },
      immediate: true
    },
    saveFunc: {
      handler(newVal) {
        if (!newVal) {
          this.$router.replace({ name: routeNames.HOME });
        }
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
    async save() {
      await this.saveFunc(this.selectedEncounter);
      this.$router.go(-1);
    },
    async cancel() {
      await this.cancelFunc();
      this.$router.go(-1);
    }
  }
};
</script>
