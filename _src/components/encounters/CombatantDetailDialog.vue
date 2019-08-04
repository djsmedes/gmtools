<template>
  <functional-dialog-wrapper
    v-bind="dialogAttrs"
    title="Combatant Detail"
    v-on="dialogListeners"
  >
    <combatant-detail
      :uuid="uuid"
      :extra-attr-data="extraAttrData"
      @save="close"
      @cancel="close(null)"
      @deleted="close(null)"
    ></combatant-detail>
  </functional-dialog-wrapper>
</template>

<script>
import functionalDialogMixin from "@/mixins/functionalDialog";
import CombatantDetail from "@/components/encounters/CombatantDetail";
import FunctionalDialogWrapper from "@/components/generic/FunctionalDialogWrapper";

export default {
  name: "CombatantDetailDialog",
  components: { FunctionalDialogWrapper, CombatantDetail },
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
};
</script>
