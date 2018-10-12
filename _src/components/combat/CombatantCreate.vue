<template>
  <form @submit.prevent="doCreateCombatant" novalidate>
    <div class="form-group">
      <label for="name">Name</label>
      <input id="name" v-model="combatant.name" placeholder="Name" class="form-control"/>
    </div>
    <div class="form-group">
      <label for="initiative">Initiative</label>
      <input id="initiative" v-model="combatant.initiative" placeholder="Initiative" type="number"
             class="form-control"/>
    </div>
    <button type="submit" class="btn btn-primary">Create</button>
  </form>
</template>

<script>
import { mapActions } from "vuex";
import combatant from "@/models/combatant";
import { routeNames } from "@/router";

export default {
  name: "CombatantCreate",
  data() {
    return {
      combatant: new combatant.Combatant()
    };
  },
  methods: {
    ...mapActions(combatant.namespace, {
      createCombatant: combatant.actionTypes.CREATE
    }),
    async doCreateCombatant() {
      await this.createCombatant(this.combatant);
      this.$router.push({ name: routeNames.COMBATANTS });
    }
  }
};
</script>
