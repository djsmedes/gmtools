<template>
  <v-dialog
    v-model="dialog"
    :max-width="width"
    :fullscreen="$vuetify.breakpoint.name === 'xs'"
    persistent
    @keydown.esc="close(null)"
  >
    <combatant-detail
      :uuid="uuid"
      :extra-attr-data="extraAttrData"
      @save="close"
      @cancel="close(null)"
      @deleted="close(null)"
    ></combatant-detail>
  </v-dialog>
</template>

<script>
import functionalDialogMixin from "@/mixins/functionalDialog";
import CombatantDetail from "@/components/encounters/CombatantDetail";

export default {
  name: "CombatantDetailDialog",
  components: { CombatantDetail },
  mixins: [functionalDialogMixin],
  props: {
    uuid: {
      type: String,
      default: null,
    },
    extraAttrData: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    width() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return;
        case "sm":
          return "400px";
        case "md":
          return "500px";
        case "lg":
          return "600px";
        case "xl":
          return "800px";
      }
    },
  },
};
</script>
