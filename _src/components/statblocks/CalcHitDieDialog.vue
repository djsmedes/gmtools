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
        <p>About how many hit points should the creature have in total?</p>
        <v-form @submit.prevent="getSuggestions">
          <v-layout>
            <v-flex grow>
              <v-text-field
                ref="firstField"
                v-model="userHpEstimate"
              ></v-text-field>
            </v-flex>
            <v-btn flat icon @click="getSuggestions">
              <v-icon>arrow_forward</v-icon>
            </v-btn>
          </v-layout>
        </v-form>
      </v-card-text>
      <v-expand-transition>
        <v-card-text v-if="suggestions.length">
          <p>Choose one of the HP suggestions below.</p>
          <v-btn
            v-for="suggestion in suggestions"
            :key="suggestion"
            :outline="selection !== suggestion"
            :depressed="selection === suggestion"
            :dark="selection === suggestion"
            color="save"
            @click="updateSelection(suggestion)"
            class="text-none"
          >
            {{ hit_point_string(suggestion) }}
          </v-btn>
          <v-layout>
            <v-spacer></v-spacer>
            <v-btn flat small color="grey">I need more choices</v-btn>
          </v-layout>
        </v-card-text>
      </v-expand-transition>
      <v-card-actions>
        <v-btn flat @click="close(false)">
          <v-icon left>cancel</v-icon>
          cancel
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          flat
          @click="close(selection)"
          color="save"
          :disabled="!selection"
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
import { calculateModifier } from "@/models/statblock";

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
    creatureCon: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      formValid: false,
      userHpEstimate: null,
      suggestions: [],
      selection: null,
      advanced: false,
      adv_hitDieSize: this.creatureHitDieSize,
      adv_con: this.creatureCon,
    };
  },
  watch: {
    dialog(val) {
      if (val) this.$nextTick(this.$refs.firstField.focus);
    },
    suggestions(val) {
      if (!val.includes(this.selection)) this.selection = null;
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
    hitDieSize() {
      return this.advanced ? this.adv_hitDieSize : this.creatureHitDieSize;
    },
    conMod() {
      return calculateModifier(this.advanced ? this.adv_con : this.creatureCon);
    },
  },
  methods: {
    getSuggestions() {
      if (!this.userHpEstimate) {
        this.suggestions = [];
        return;
      }

      let denom = (this.hitDieSize + 1) / 2 + this.conMod;
      let x = this.userHpEstimate / denom;
      let under = Math.floor(x);
      this.suggestions = [under, ...(under === x ? [] : [Math.ceil(x)])];
    },
    hit_point_string(numHitDie) {
      let con_contribution = numHitDie * this.conMod;

      let avg =
        Math.floor(numHitDie * ((this.hitDieSize + 1) / 2)) + con_contribution;

      let con_piece = "";
      if (con_contribution > 0) {
        con_piece = " + " + String(con_contribution);
      } else if (con_contribution < 0) {
        con_piece = " - " + String(Math.abs(con_contribution));
      }

      return avg + " (" + numHitDie + "d" + this.hitDieSize + con_piece + ")";
    },
    updateSelection(suggestion) {
      this.selection = this.selection === suggestion ? null : suggestion;
    },
  },
};
</script>
