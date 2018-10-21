<template>
  <object-detail
      :name="localEncounter.name"
      :start-editing="!encounter.uuid"
      :save-func="encounter.uuid ? save : create"
      :clear-func="encounter.uuid ? reset : () => $router.go(-1)"
      :delete-func="encounter.uuid ? deleteSelf : null">
    <v-list slot="view">
      <v-subheader>
        Name
      </v-subheader>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title>
            {{ encounter.name }}
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
    <v-container slot="edit">
      <v-form submit.prevent>
        <v-layout row wrap>
          <v-flex xs6 sm4 md3>
            <v-text-field
                label="Name"
                v-model="localEncounter.name"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-form>

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
            <v-card-title><h4>{{ item.name }}</h4></v-card-title>
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
</template>

<script>
import ObjectDetail from "@/components/generic/ObjectDetail";
import { mapGetters, mapActions } from "vuex";
import encounter, { Encounter } from "@/models/encounter";
import combatant, { Combatant } from "@/models/combatant";
import { routeNames } from "@/router";

export default {
  name: "EncounterDetail",
  components: { ObjectDetail },
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
      }
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
  created() {
    Promise.all([this.loadEncounters(), this.loadCombatants()]).then(() =>
      this.reset()
    );
  }
};
</script>
