<template>
  <object-list
      :detail-view-name="routeNames.ENCOUNTER"
      :create-view-name="routeNames.ENCOUNTER_CREATE"
      :object-list="encounters">
  </object-list>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ObjectList from "@/components/generic/ObjectList";
import { routeNames } from "@/router";
import encounter from "@/models/encounter";

export default {
  name: "EncounterList",
  components: { ObjectList },
  data() {
    return {
      routeNames
    };
  },
  computed: {
    ...mapGetters(encounter.namespace, {
      encounters: encounter.getterTypes.LIST
    })
  },
  methods: {
    ...mapActions(encounter.namespace, {
      loadEncounters: encounter.actionTypes.LIST
    })
  },
  created() {
    this.loadEncounters();
  }
};
</script>
