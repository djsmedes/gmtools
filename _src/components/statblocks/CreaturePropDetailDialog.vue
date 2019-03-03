<template>
  <v-dialog
    v-model="dialog"
    :max-width="width"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    persistent
    @keydown.esc="close(null)"
  >
    <v-toolbar dark color="grey darken-2" dense>
      <v-toolbar-title>Editing Creature Property</v-toolbar-title>
    </v-toolbar>
    <v-card tile>
      <creature-prop-detail :uuid="uuid"></creature-prop-detail>
      <v-card-actions>
        <v-btn flat @click="close(false)">
          <v-icon left>cancel</v-icon>
          cancel
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn flat @click="close(returnValue)" color="save">
          <v-icon left>save</v-icon>
          save & close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import functionalDialogMixin from "@/mixins/functionalDialog";
import CreaturePropDetail from "@/components/statblocks/CreaturePropDetail";

export default {
  name: "CreaturePropDetailDialog",
  components: { CreaturePropDetail },
  mixins: [functionalDialogMixin],
  props: {
    uuid: {
      type: String,
      default: null,
    },
  },
  computed: {
    width() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "220px";
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
