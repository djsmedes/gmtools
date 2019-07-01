<template>
  <object-list
    :detail-view-name="$routeNames.STATBLOCK"
    :create-view-name="$routeNames.STATBLOCK_CREATE"
    :object-list="statblocks.models"
  ></object-list>
</template>

<script>
import ObjectList from "@/components/generic/ObjectList";
import { StatblockList } from "@/models";

export default {
  name: "StatblockList",
  components: { ObjectList },
  data() {
    return {
      statblocks: new StatblockList(),
    };
  },
  created() {
    this.statblocks.fetch();
  },
};
</script>
