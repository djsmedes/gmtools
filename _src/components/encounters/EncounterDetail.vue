<template>
  <object-detail
    @enter-edit-mode="viewMode = false"
    @enter-view-mode="viewMode = true"
    :name="localEncounter.name"
    :start-editing="!encounter.uuid"
    :save-func="encounter.uuid ? save : create"
    :clear-func="encounter.uuid ? reset : () => $router.go(-1)"
    :delete-func="encounter.uuid ? deleteSelf : null"
  >
    <v-container slot-scope="{ isViewMode }" grid-list-lg>
      <v-layout row wrap>
        <v-flex xs6 sm4 md3>
          <v-text-field
            :disabled="isViewMode"
            :class="{ 'disabled-means-display': isViewMode }"
            label="Name"
            v-model="localEncounter.name"
          ></v-text-field>
        </v-flex>
      </v-layout>

      <v-data-iterator
        :items="combatants"
        :pagination.sync="combatantPagination"
        hide-actions
        no-data-text="No combatants"
        content-tag="v-layout"
        row
        wrap
      >
        <v-flex slot="item" slot-scope="{ item }" xs6 sm4 md3>
          <v-card>
            <v-card-title>
              <h4>{{ item.name }}</h4>
              <v-spacer></v-spacer>
              <v-btn
                v-if="!isViewMode"
                @click="openCombatantDialog(item.uuid)"
                small
                flat
                icon
                class="ma-0"
              >
                <v-icon small>edit</v-icon>
              </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-list dense>
              <v-list-tile>
                <v-list-tile-content>Loot:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{
                  item.loot
                }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-flex>
      </v-data-iterator>
      <v-btn
        v-if="!isViewMode && encounter.uuid"
        flat
        @click="openCombatantDialog(null)"
        >+ Add Combatant</v-btn
      >
    </v-container>
  </object-detail>
</template>

<script>
import ObjectDetail from "@/components/generic/ObjectDetail";
import CombatantDetailDialog from "@/components/encounters/CombatantDetailDialog";
import { mapGetters, mapActions } from "vuex";
import encounter, { Encounter } from "@/models/encounter";
import combatant from "@/models/combatant_mc";
import { routeNames } from "@/router";
import { needLoading, doneLoading } from "@/utils/loading";

export default {
  name: "EncounterDetail",
  components: { ObjectDetail },
  props: {
    uuid: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      localEncounter: new Encounter(),
      combatantPagination: {
        rowsPerPage: -1,
      },
      viewMode: true,
    };
  },
  computed: {
    encounter() {
      return this.getEncounter(this.uuid);
    },
    ...mapGetters(encounter.namespace, {
      getEncounter: encounter.getterTypes.BY_ID,
    }),
    ...mapGetters(combatant.namespace, {
      allCombatants: combatant.getterTypes.LIST,
    }),
    combatants() {
      return this.allCombatants.filter(c => c.encounter === this.uuid);
    },
  },
  methods: {
    ...mapActions(encounter.namespace, {
      loadEncounter: encounter.actionTypes.RETRIEVE,
      deleteEncounter: encounter.actionTypes.DESTROY,
      updateEncounter: encounter.actionTypes.UPDATE,
      createEncounter: encounter.actionTypes.CREATE,
    }),
    ...mapActions(combatant.namespace, {
      loadCombatants: combatant.actionTypes.QUERY_LIST,
    }),
    async deleteSelf() {
      await this.deleteEncounter(this.encounter.uuid);
      this.$router.push({ name: routeNames.ENCOUNTERS });
    },
    async save() {
      await this.updateEncounter(this.localEncounter);
      this.reset();
    },
    async create() {
      let rObj = await this.createEncounter(this.localEncounter);
      this.$router.replace({
        name: routeNames.ENCOUNTER,
        params: { uuid: rObj.uuid },
      });
    },
    reset() {
      this.localEncounter = new Encounter(this.encounter);
    },
    async openCombatantDialog(combatantUuid) {
      await this.$dialog(CombatantDetailDialog, {
        ...(combatantUuid
          ? { uuid: combatantUuid }
          : { extraAttrData: { encounter: this.uuid } }),
      });
    },
  },
  async created() {
    needLoading();
    await Promise.all([
      this.loadEncounter({ uuid: this.uuid }),
      this.loadCombatants({ encounter: this.uuid }),
    ]);
    this.reset();
    doneLoading();
  },
};
</script>
