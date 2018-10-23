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

      <v-container slot-scope="{ isViewMode }">
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
                <v-btn small flat icon class="ma-0"><v-icon small>edit</v-icon></v-btn>
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
      </v-container>
    </object-detail>
  </display-when-loaded>
</template>

<script>
import ObjectDetail from "@/components/generic/ObjectDetail";
import { mapGetters, mapActions } from "vuex";
import encounter, { Encounter } from "@/models/encounter";
import combatant, { Combatant } from "@/models/combatant";
import { routeNames } from "@/router";
import DisplayWhenLoaded from "@/components/generic/DisplayWhenLoaded";

export default {
  name: "EncounterDetail",
  components: { DisplayWhenLoaded, ObjectDetail },
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
      viewMode: true
    };
  },
  computed: {
    encounter() {
      let uuid = this.$route.params.uuid || this.encounterUuid;
      return uuid ? this.getEncounter(uuid) : new Encounter();
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
      loadCombatants: combatant.actionTypes.LIST
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
        params: { uuid: rObj.uuid }
      });
    },
    reset() {
      this.localEncounter = new Encounter(this.encounter);
      this.localCombatants = this.combatants.map(
        combatant => new Combatant(combatant)
      );
    }
  },
  async created() {
    await Promise.all([this.loadEncounters(), this.loadCombatants()]);
    this.reset();
    this.isLoaded = true;
  }
};
</script>
