<template>
  <object-detail :name="combatant.name"
                 :start-editing="!combatant.uuid"
                 :save-func="combatant.uuid ? save : create"
                 :clear-func="combatant.uuid ? reset : () => $router.go(-1)"
                 :delete-func="combatant.uuid ? deleteSelf : null">
    <v-list slot="view">
      <v-subheader>
        Name
      </v-subheader>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title>
            {{ combatant.name }}
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider></v-divider>
      <v-subheader>
        Loot
      </v-subheader>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title class="text-truncate">
            {{ combatant.loot }}
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
    <v-card-text slot="edit">
      <v-form>
        <v-text-field
            label="Name"
            v-model="localCombatant.name"
        ></v-text-field>
        <v-textarea
            auto-grow :rows="1"
            label="Loot"
            v-model="localCombatant.loot"
        ></v-textarea>
      </v-form>
    </v-card-text>
  </object-detail>
</template>

<script>
import ObjectDetail from "@/components/generic/ObjectDetail";
import { mapGetters, mapActions } from "vuex";
import combatant, { Combatant } from "@/models/combatant";
import { routeNames } from "@/router";

export default {
  name: "CombatantDetail",
  components: { ObjectDetail },
  data() {
    return {
      localCombatant: new Combatant()
    };
  },
  computed: {
    combatant() {
      let uuid = this.$route.params.uuid;
      return uuid ? this.getCombatant(uuid) : new Combatant();
    },
    ...mapGetters(combatant.namespace, {
      getCombatant: combatant.getterTypes.BY_ID
    })
  },
  methods: {
    ...mapActions(combatant.namespace, {
      loadCombatants: combatant.actionTypes.LIST,
      deleteCombatant: combatant.actionTypes.DESTROY,
      updateCombatant: combatant.actionTypes.UPDATE,
      createCombatant: combatant.actionTypes.CREATE
    }),
    async deleteSelf() {
      await this.deleteCombatant(this.combatant.uuid);
      this.$router.push({ name: routeNames.COMBATANTS });
    },
    async save() {
      await this.updateCombatant(this.localCombatant);
      this.reset();
    },
    async create() {
      let rObj = await this.createCombatant(this.localCombatant);
      this.$router.replace({
        name: routeNames.COMBATANT,
        params: { uuid: rObj.uuid }
      });
    },
    reset() {
      this.localCombatant = new Combatant(this.combatant);
    }
  },
  created() {
    this.loadCombatants().then(() => this.reset());
  }
};
</script>