<template>
  <object-list
    :detail-view-name="$routeNames.COMBATANT"
    :create-view-name="$routeNames.COMBATANT_CREATE"
    :object-list="combatants.models"
    :headers="headers"
  ></object-list>
</template>

<script>
import ObjectList from "@/components/generic/ObjectList";
import { CombatantList } from "@/models/combatant";

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
      combatants: new CombatantList([], {
        storeFilter: { encounter: null },
      }),
    };
  },
  created() {
    this.combatants.fetch();
  },
};
</script>
