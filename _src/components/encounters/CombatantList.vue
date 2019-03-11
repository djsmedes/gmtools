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
import combatant from "@/models/combatant_mc";

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
      combatants: combatant.getterTypes.LIST,
    }),
  },
  methods: {
    ...mapActions(combatant.namespace, {
      loadCombatants: combatant.actionTypes.LIST,
    }),
  },
  created() {
    this.loadCombatants();
  },
};
</script>
