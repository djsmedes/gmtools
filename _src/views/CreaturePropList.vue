<template>
  <object-list
    :detail-view-name="$routeNames.CREATUREPROP"
    :object-list="creatureProps.models"
    :headers="headers"
  ></object-list>
</template>

<script>
import ObjectList from "@/components/generic/ObjectList";
import { CreaturePropList } from "@/models";

export default {
  name: "StatblockList",
  components: { ObjectList },
  data() {
    return {
      creatureProps: new CreaturePropList(),
      headers: [
        {
          text: "Title",
          align: "left",
          value: "title",
        },
      ],
    };
  },
  created() {
    this.creatureProps.fetch();
  },
};
</script>
