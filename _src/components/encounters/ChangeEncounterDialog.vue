<template>
  <functional-dialog-wrapper
    v-bind="dialogAttrs"
    title="Change Encounter"
    v-on="dialogListeners"
  >
    <encounter-chooser>
      <template #actions="{ selectedEncounter }">
        <v-spacer></v-spacer>
        <v-btn text @click="close(null)">
          <v-icon left>cancel</v-icon>
          Cancel
        </v-btn>
        <v-btn text color="save" @click="close(selectedEncounter.uuid)">
          <v-icon left>save</v-icon>
          Save
        </v-btn>
      </template>
    </encounter-chooser>
  </functional-dialog-wrapper>
</template>

<script>
import EncounterChooser from "@/components/encounters/EncounterChooser";
import { functionalDialogMixin } from "@/mixins";
import FunctionalDialogWrapper from "@/components/generic/FunctionalDialogWrapper";

export default {
  name: "ChangeEncounterDialog",
  components: { FunctionalDialogWrapper, EncounterChooser },
  mixins: [functionalDialogMixin],
};
</script>
