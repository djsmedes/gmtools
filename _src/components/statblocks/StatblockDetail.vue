<template>
  <div>
    <pre>{{ JSON.stringify(statblock, null, 2) }}</pre>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import statblock, { Statblock } from "@/models/statblock";
import { routeNames } from "@/router";

export default {
  name: "StatblockDetail",
  props: {
    uuid: {
      type: String,
      default: null,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(statblock.namespace, {
      getStatblock: statblock.getterTypes.BY_ID,
    }),
    statblock() {
      return this.getStatblock(this.uuid);
    },
  },
  methods: {
    ...mapActions(statblock.namespace, {
      loadStatblock: statblock.actionTypes.RETRIEVE,
    }),
  },
  created() {
    this.loadStatblock({ uuid: this.uuid });
  },
};
</script>
