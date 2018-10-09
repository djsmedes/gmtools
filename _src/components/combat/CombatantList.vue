<template>
  <object-list :model="model"
               :detail-view-name="routeNames.COMBATANT"
               :create-view-name="routeNames.COMBATANT_CREATE"
               :object-list="combatants">
  </object-list>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ObjectList from "@/components/generic/ObjectList";
import { routeNames } from "@/router";
import combatant from "@/models/combatant";

export default {
  name: "CombatantList",
  components: { ObjectList },
  data() {
    return {
      routeNames,
      model: combatant
    };
  },
  computed: {
    ...mapGetters(combatant.namespace, {
      combatants: combatant.getterTypes.LIST
    })
  },
  methods: {
    ...mapActions(combatant.namespace, {
      loadCombatants: combatant.actionTypes.LIST
    })
  },
  created() {
    this.loadCombatants();
  }
};
</script>
