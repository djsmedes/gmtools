<template>
  <object-detail
    :name="combatant.name || 'New Combatant'"
    :start-editing="startEditing || (!$route.params.uuid && !combatantUuid)"
    :save-func="
      saveFunc ? () => saveFunc(localCombatant) : combatant.uuid ? save : create
    "
    :clear-func="
      cancelFunc
        ? () => cancelFunc(localCombatant)
        : combatant.uuid
        ? reset
        : () => $router.go(-1)
    "
    :delete-func="
      deleteFunc
        ? () => deleteFunc(localCombatant)
        : combatant.uuid
        ? deleteSelf
        : null
    "
  >
    <v-card-text slot-scope="{ isViewMode }">
      <v-form @submit.prevent>
        <v-text-field
          :disabled="isViewMode"
          :class="{ 'disabled-means-display': isViewMode }"
          label="Name"
          v-model="localCombatant.name"
        ></v-text-field>
        <v-textarea
          :disabled="isViewMode"
          :class="{ 'disabled-means-display': isViewMode }"
          auto-grow
          :rows="1"
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
  props: {
    combatantUuid: {
      type: String,
      default: null,
    },
    saveFunc: {
      type: Function,
      default: null,
    },
    cancelFunc: {
      type: Function,
      default: null,
    },
    deleteFunc: {
      type: Function,
      default: null,
    },
    startEditing: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      localCombatant: new Combatant(),
    };
  },
  computed: {
    combatant() {
      let uuid = this.combatantUuid || this.$route.params.uuid;
      return this.getCombatant(uuid);
    },
    ...mapGetters(combatant.namespace, {
      getCombatant: combatant.getterTypes.BY_ID,
    }),
  },
  watch: {
    combatant: {
      handler() {
        this.reset();
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions(combatant.namespace, {
      loadCombatants: combatant.actionTypes.LIST,
      deleteCombatant: combatant.actionTypes.DESTROY,
      updateCombatant: combatant.actionTypes.UPDATE,
      createCombatant: combatant.actionTypes.CREATE,
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
        params: { uuid: rObj.uuid },
      });
    },
    reset() {
      this.localCombatant = new Combatant(this.combatant);
    },
  },
  created() {
    this.loadCombatants();
  },
};
</script>
