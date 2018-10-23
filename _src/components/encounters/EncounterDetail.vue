<template>
  <display-when-loaded :is-loaded="isLoaded">
    <object-detail
        @enter-edit-mode="viewMode = false"
        @enter-view-mode="viewMode = true"
        :name="localEncounter.name"
        :start-editing="!encounter.uuid"
        :save-func="encounter.uuid ? save : create"
        :clear-func="encounter.uuid ? reset : () => $router.go(-1)"
        :delete-func="encounter.uuid ? deleteSelf : null">

      <v-container slot-scope="{ isViewMode }" grid-list-lg>
        <v-layout row wrap>
          <v-flex xs6 sm4 md3>
            <v-text-field
                :disabled="isViewMode"
                :class="{'disabled-means-display': isViewMode}"
                label="Name"
                v-model="localEncounter.name"
            ></v-text-field>
          </v-flex>
        </v-layout>

        <v-data-iterator
            :items="localCombatants"
            :pagination.sync="combatantPagination"
            hide-actions
            no-data-text="No combatants"
            content-tag="v-layout"
            row wrap>
          <v-flex
              slot="item" slot-scope="{ item }"
              xs6 sm4 md3>
            <v-card>
              <v-card-title>
                <h4>{{ item.name }}</h4>
                <v-spacer></v-spacer>
                <v-btn
                    v-if="!isViewMode"
                    @click="openCombatantDialog(item.uuid)"
                    small flat icon class="ma-0">
                  <v-icon small>edit</v-icon>
                </v-btn>
              </v-card-title>
              <v-divider></v-divider>
              <v-list dense>
                <v-list-tile>
                  <v-list-tile-content>Loot:</v-list-tile-content>
                  <v-list-tile-content class="align-end">{{ item.loot }}</v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-flex>
        </v-data-iterator>
        <v-btn v-if="!isViewMode && encounter.uuid" flat @click="openCombatantDialog('new')">+ Add Combatant</v-btn>
      </v-container>
    </object-detail>
    <v-dialog width="900" persistent v-model="combatantDialog">
      <combatant-detail
        :combatant-uuid="combatantDialogUuid"
        :save-func="combatantDialogSave"
        :cancel-func="combatantDialogCancel"
        :delete-func="combatantDialogDelete"
        :start-editing="combatantDialog"
      ></combatant-detail>
    </v-dialog>

  </display-when-loaded>
</template>

<script>
import ObjectDetail from "@/components/generic/ObjectDetail";
import CombatantDetail from "@/components/encounters/CombatantDetail";
import { mapGetters, mapActions } from "vuex";
import encounter, { Encounter } from "@/models/encounter";
import combatant, { Combatant } from "@/models/combatant";
import { routeNames } from "@/router";
import DisplayWhenLoaded from "@/components/generic/DisplayWhenLoaded";

export default {
  name: "EncounterDetail",
  components: { DisplayWhenLoaded, ObjectDetail, CombatantDetail },
  props: {
    encounterUuid: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      localEncounter: new Encounter(),
      localCombatants: [],
      combatantPagination: {
        rowsPerPage: -1
      },
      isLoaded: false,
      viewMode: true,
      combatantDialog: false,
      combatantDialogUuid: null
    };
  },
  computed: {
    encounter() {
      let uuid = this.encounterUuid || this.$route.params.uuid;
      return this.getEncounter(uuid);
    },
    ...mapGetters(encounter.namespace, {
      getEncounter: encounter.getterTypes.BY_ID
    }),
    ...mapGetters(combatant.namespace, {
      getCombatant: combatant.getterTypes.BY_ID,
      getAllCombatants: combatant.getterTypes.LIST
    }),
    combatants() {
      return this.getAllCombatants.filter(
        combatant => combatant.encounter === this.encounter.uuid
      );
    }
  },
  watch: {
    encounterUuid() {
      this.reset();
    }
  },
  methods: {
    ...mapActions(encounter.namespace, {
      loadEncounters: encounter.actionTypes.LIST,
      deleteEncounter: encounter.actionTypes.DESTROY,
      updateEncounter: encounter.actionTypes.UPDATE,
      createEncounter: encounter.actionTypes.CREATE
    }),
    ...mapActions(combatant.namespace, {
      loadCombatants: combatant.actionTypes.LIST,
      updateCombatant: combatant.actionTypes.UPDATE,
      deleteCombatant: combatant.actionTypes.DESTROY,
      createCombatant: combatant.actionTypes.CREATE
    }),
    async deleteSelf() {
      await this.deleteEncounter(this.encounter.uuid);
      this.$router.push({ name: routeNames.ENCOUNTERS });
    },
    async save() {
      await Promise.all([
        this.updateEncounter(this.localEncounter),
        ...this.localCombatants.map(combatant => {
          if (this.combatants.map(c => c.uuid).includes(combatant.uuid)) {
            return this.updateCombatant(combatant);
          } else {
            return this.createCombatant({
              ...combatant,
              encounter: this.encounter.uuid
            });
          }
        }),
        ...this.combatants
          .filter(
            c => !this.localCombatants.map(lc => lc.uuid).includes(c.uuid)
          )
          .map(combatant => {
            return this.deleteCombatant(combatant.uuid);
          })
      ]);
      this.reset();
    },
    async create() {
      let rObj = await this.createEncounter(this.localEncounter);
      this.$router.replace({
        name: routeNames.ENCOUNTER,
        params: { uuid: rObj.uuid }
      });
    },
    reset() {
      this.localEncounter = new Encounter(this.encounter);
      this.localCombatants = this.combatants.map(
        combatant => new Combatant(combatant)
      );
    },
    openCombatantDialog(combatantUuid) {
      this.combatantDialogUuid = combatantUuid;
      this.combatantDialog = true;
    },
    combatantDialogSave(updatedCombatant) {
      if (updatedCombatant.uuid) {
        this.localCombatants = this.localCombatants.map(
          combatant =>
            combatant.uuid === updatedCombatant.uuid
              ? updatedCombatant
              : combatant
        );
      } else {
        this.localCombatants.push(updatedCombatant);
      }
      this.closeCombatantDialog();
    },
    combatantDialogCancel() {
      this.closeCombatantDialog();
    },
    combatantDialogDelete() {
      this.localCombatants = this.localCombatants.filter(
        c => c.uuid !== this.combatantDialogUuid
      );
      this.closeCombatantDialog();
    },
    closeCombatantDialog() {
      this.combatantDialogUuid = null;
      this.combatantDialog = false;
    }
  },
  async created() {
    await Promise.all([this.loadEncounters(), this.loadCombatants()]);
    this.reset();
    this.isLoaded = true;
  }
};
</script>
