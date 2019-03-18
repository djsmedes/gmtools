<template>
  <object-list
    :detail-view-name="$routeNames.CREATUREPROP"
    :object-list="objects"
    :headers="headers"
  ></object-list>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ObjectList from "@/components/generic/ObjectList";
import creatureprop from "@/models/creatureprop";

export default {
  name: "StatblockList",
  components: { ObjectList },
  data() {
    return {
      headers: [
        {
          text: "Title",
          align: "left",
          value: "title",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(creatureprop.namespace, {
      objects: creatureprop.getterTypes.LIST,
    }),
  },
  methods: {
    ...mapActions(creatureprop.namespace, {
      loadObjects: creatureprop.actionTypes.LIST,
    }),
  },
  created() {
    this.loadObjects();
  },
};
</script>
