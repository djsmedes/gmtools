<template>
  <v-dialog width="500" v-model="dialog">
    <v-btn slot="activator" flat>
      Change
    </v-btn>
    <encounter-chooser>
      <template slot="actions" slot-scope="{ selectedEncounter }">
        <v-btn flat @click="close(selectedEncounter.uuid)">
          Save
        </v-btn>
        <v-btn flat @click="close(null)">
          Cancel
        </v-btn>
      </template>
    </encounter-chooser>
  </v-dialog>
</template>

<script>
import EncounterChooser from "@/components/encounters/EncounterChooser";
import { functionalDialogMixin } from "@/mixins";

export default {
  name: "ChangeEncounterDialog",
  components: { EncounterChooser },
  mixins: [functionalDialogMixin],
};
</script>
