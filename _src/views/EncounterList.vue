<template>
  <object-list
    :detail-view-name="$routeNames.ENCOUNTER"
    :create-view-name="$routeNames.ENCOUNTER_CREATE"
    :object-list="encounters.models"
  ></object-list>
</template>

<script>
import ObjectList from "@/components/generic/ObjectList";
import { EncounterList } from "@/models/encounter";

export default {
  name: "EncounterList",
  components: { ObjectList },
  data() {
    return {
      encounters: new EncounterList(),
    };
  },
  created() {
    this.encounters.fetch();
  },
};
</script>
