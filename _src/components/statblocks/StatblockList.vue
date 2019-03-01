<template>
  <object-list
    :detail-view-name="routeNames.STATBLOCK"
    :object-list="statblocks"
  ></object-list>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ObjectList from "@/components/generic/ObjectList";
import { routeNames } from "@/router";
import statblock from "@/models/statblock_mc";

export default {
  name: "StatblockList",
  components: { ObjectList },
  data() {
    return {
      routeNames,
    };
  },
  computed: {
    ...mapGetters(statblock.namespace, {
      statblocks: statblock.getterTypes.LIST,
    }),
  },
  methods: {
    ...mapActions(statblock.namespace, {
      loadStatblocks: statblock.actionTypes.LIST,
    }),
  },
  created() {
    this.loadStatblocks();
  },
};
</script>
