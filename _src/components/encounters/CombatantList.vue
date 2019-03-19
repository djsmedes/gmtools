<template>
  <object-list
    :detail-view-name="$routeNames.COMBATANT"
    :create-view-name="$routeNames.COMBATANT_CREATE"
    :object-list="combatants"
    :headers="headers"
  ></object-list>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ObjectList from "@/components/generic/ObjectList";
import combatant, { Combatant } from "@/models/combatant";

export default {
  name: "CombatantList",
  components: { ObjectList },
  data() {
    return {
      headers: [
        {
          text: "Name",
          align: "left",
          value: "name",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(combatant.namespace, {
      // combatants: combatant.getterTypes.LIST,
    }),
    combatants() {
      return []
    }
  },
  methods: {
    ...mapActions(combatant.namespace, {
      // loadCombatants: combatant.actionTypes.LIST,
    }),
  },
  created() {
    // this.loadCombatants();
    let foo = new Combatant();
    this.$store.commit("$_vue-mc_combatant/addToFoo", 2);
    this.$store.commit("$_vue-mc_combatant/addToFoo", 2);
  },
};
</script>
