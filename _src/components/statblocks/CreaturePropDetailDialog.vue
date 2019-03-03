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
      <creature-prop-detail :uuid="uuid">
        <template #actions="{ saveFunc }">
          <v-btn flat @click="close(false)">
            <v-icon left>cancel</v-icon>
            cancel
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn flat @click="saveAndClose(saveFunc)" color="save">
            <v-icon left>save</v-icon>
            save & close
          </v-btn>
        </template>
      </creature-prop-detail>
    </v-card>
  </v-dialog>
</template>

<script>
import functionalDialogMixin from "@/mixins/functionalDialog";
import CreaturePropDetail from "@/components/statblocks/CreaturePropDetail";
import axios from "axios";
import { generateUrl } from "@/utils/urls";

export default {
  name: "CreaturePropDetailDialog",
  components: { CreaturePropDetail },
  mixins: [functionalDialogMixin],
  props: {
    uuid: {
      type: String,
      default: null,
    },
    parentStatblockUuid: {
      type: String,
      required: true,
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
  methods: {
    async saveAndClose(saveFunc) {
      let newCreatureProp = await saveFunc();
      let { data } = await axios.post(generateUrl(["statblockprop"]), {
        creature_prop: newCreatureProp.uuid,
        statblock: this.parentStatblockUuid,
      });
      this.close(data);
    },
  },
};
</script>
