<template>
  <object-detail
    @enter-edit-mode="viewMode = false"
    @enter-view-mode="viewMode = true"
    :name="encounter.name"
    :start-editing="encounter.isNew()"
    :save-func="encounter.save"
    :clear-func="
      encounter.isExisting() ? encounter.reset : () => $router.go(-1)
    "
    :delete-func="encounter.isExisting() ? deleteSelf : null"
  >
    <v-container slot-scope="{ isViewMode }" grid-list-lg>
      <v-layout wrap>
        <v-flex xs6 sm4 md3>
          <v-text-field
            :disabled="isViewMode"
            label="Name"
            v-model="encounter.name"
          ></v-text-field>
        </v-flex>
      </v-layout>

      <v-data-iterator
        :items="combatants.models"
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
                <v-list-tile-content class="align-end">
                  {{ item.loot }}
                </v-list-tile-content>
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
import { Encounter, CombatantList } from "@/models";

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
      encounter: new Encounter({ uuid: this.uuid }),
      combatants: new CombatantList([], {
        storeFilter: { encounter: this.uuid },
      }),
      combatantPagination: {
        rowsPerPage: -1,
      },
      viewMode: true,
    };
  },
  async created() {
    this.$store.commit("needLoading");
    await Promise.all([this.encounter.fetch(), this.combatants.fetch()]);
    this.$store.commit("doneLoading");
  },
  methods: {
    async deleteSelf() {
      await this.encounter.delete();
      this.$router.push({ name: this.$routeNames.ENCOUNTERS });
    },
    async openCombatantDialog(combatantUuid) {
      await this.$dialog(CombatantDetailDialog, {
        ...(combatantUuid
          ? { uuid: combatantUuid }
          : { extraAttrData: { encounter: this.uuid } }),
      });
    },
  },
};
</script>
