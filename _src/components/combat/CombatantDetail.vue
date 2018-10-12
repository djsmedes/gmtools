<template>
  <object-detail :title="combatant.name"
                 :save-func="save"
                 :clear-func="reset"
                 :delete-func="deleteSelf">
    <template slot="view">
      <div class="card-body">
        <h5>Name:</h5>
        <p>{{ combatant.name }}</p>
      </div>
    </template>
    <template slot="edit">
      <div class="card-body">
        <form novalidate @submit.stop.prevent>
          <div class="form-group">
            <label for="editName">Name</label>
            <input id="editName" class="form-control" v-model="localCombatant.name">
          </div>
        </form>
      </div>
    </template>
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
      return this.getCombatant(this.$route.params.uuid);
    },
    ...mapGetters(combatant.namespace, {
      getCombatant: combatant.getterTypes.BY_ID
    })
  },
  methods: {
    ...mapActions(combatant.namespace, {
      loadCombatants: combatant.actionTypes.LIST,
      deleteCombatant: combatant.actionTypes.DESTROY,
      updateCombatant: combatant.actionTypes.UPDATE
    }),
    async deleteSelf() {
      await this.deleteCombatant(this.combatant.uuid);
      this.$router.push({ name: routeNames.COMBATANTS });
    },
    async save() {
      await this.updateCombatant(this.localCombatant);
      this.reset();
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
