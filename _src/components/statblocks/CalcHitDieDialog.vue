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
            <v-btn flat small color="grey" @click="advanced = !advanced">
              {{ advanced ? "hide advanced options" : "I need more choices" }}
            </v-btn>
          </v-layout>
          <v-expand-transition>
            <v-form @submit.prevent v-if="advanced">
              <p>
                Tweak the constitution score (which controls the constant
                contribution to HP) and size (which controls the size of the hit
                dice) to reach your desired HP total.
              </p>
              <p>
                Reducing the constitution or size of the creature will mean that
                each hit die adds a smaller increment, making it easier to get
                closer to a desired HP total, but using more hit die.
              </p>
              <v-container grid-list-xl>
                <v-layout wrap>
                  <v-flex xs6>
                    <v-text-field
                      label="Constitution score"
                      :value="adv_con"
                      @input="updateAdvCon"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs6>
                    <v-select
                      label="Size"
                      :items="sizeChoices"
                      v-model="adv_size"
                    ></v-select>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-form>
          </v-expand-transition>
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
          @click="close(returnValue)"
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
import { calculateModifier, sizeChoices } from "@/models/statblock";
import { debounce } from "lodash-es";

const size_2_die = {
  1: 4,
  2: 6,
  3: 8,
  4: 10,
  5: 12,
  6: 20,
};

const die_2_size = {
  4: 1,
  6: 2,
  8: 3,
  10: 4,
  12: 5,
  20: 6,
};

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
      sizeChoices,
      formValid: false,
      userHpEstimate: null,
      suggestions: [],
      selection: null,
      advanced: false,
      adv_size: die_2_size[this.creatureHitDieSize],
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
    adv_con() {
      this.getSuggestions();
    },
    adv_size() {
      this.getSuggestions();
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
    adv_hitDieSize() {
      return size_2_die[this.adv_size];
    },
    hitDieSize() {
      return this.advanced ? this.adv_hitDieSize : this.creatureHitDieSize;
    },
    conMod() {
      return calculateModifier(this.advanced ? this.adv_con : this.creatureCon);
    },
    returnValue() {
      return {
        num_hit_die: this.selection,
        ...(this.advanced ? { size: this.adv_size, con: this.adv_con } : {}),
      };
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
      if (this.avg_hp(under) === Number(this.userHpEstimate)) {
        this.suggestions = [under];
        return;
      }

      let over = Math.ceil(x);
      if (this.avg_hp(over) === Number(this.userHpEstimate)) {
        this.suggestions = [over];
        return;
      }

      this.suggestions = [under, ...(over === under ? [] : [over])];
    },
    avg_hp(numHitDie) {
      return Math.floor(numHitDie * ((this.hitDieSize + 1) / 2 + this.conMod));
    },
    hit_point_string(numHitDie) {
      let con_contribution = numHitDie * this.conMod;

      let con_piece = "";
      if (con_contribution > 0) {
        con_piece = " + " + String(con_contribution);
      } else if (con_contribution < 0) {
        con_piece = " - " + String(Math.abs(con_contribution));
      }

      return (
        this.avg_hp(numHitDie) +
        " (" +
        numHitDie +
        "d" +
        this.hitDieSize +
        con_piece +
        ")"
      );
    },
    updateSelection(suggestion) {
      this.selection = this.selection === suggestion ? null : suggestion;
    },
    updateAdvCon: debounce(function(value) {
      this.adv_con = Number(value) || null;
    }, 250),
  },
};
</script>
