<template>
  <v-dialog
    v-model="dialog"
    :max-width="width"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    persistent
    @keydown.esc="close(null)"
  >
    <v-toolbar dark color="grey darken-2" dense>
      <v-toolbar-title>Calculate Hit Dice</v-toolbar-title>
    </v-toolbar>
    <v-card tile>
      <v-card-text>
        <v-form @submit.prevent>
          <v-text-field
            ref="firstField"
            label="About how many hit points should the creature have in total?"
          ></v-text-field>
        </v-form>
        <v-slide-y-transition>
          <v-form @submit.prevent v-model="formValid" v-if="suggestions.length">

          </v-form>
        </v-slide-y-transition>
      </v-card-text>
      <v-card-actions>
        <v-btn flat @click="close(false)">
          <v-icon left>cancel</v-icon>
          cancel
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          flat
          @click="() => {}"
          color="save"
          :disabled="!formValid || !suggestions.length"
        >
          <v-icon left>save</v-icon>
          use selection
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import functionalDialogMixin from "@/mixins/functionalDialog";

export default {
  name: "CalcHitDieDialog",
  mixins: [functionalDialogMixin],
  props: {
    creatureSizeDisplay: {
      type: String,
      required: true,
    },
    creatureHitDieSize: {
      type: Number,
      required: true,
    },
    creatureConMod: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      formValid: false,
      suggestions: [],
    };
  },
  watch: {
    dialog(val) {
      if (val) this.$nextTick(this.$refs.firstField.focus);
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
  },
};
</script>
