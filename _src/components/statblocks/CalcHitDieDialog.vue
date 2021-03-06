<template>
  <functional-dialog-wrapper
    v-bind="dialogAttrs"
    title="Calculate Hit Dice"
    v-on="dialogListeners"
  >
    <v-card-text>
      <p>About how many hit points should the creature have in total?</p>
      <v-form @submit.prevent="getSuggestions">
        <v-text-field ref="firstField" v-model="userHpEstimate">
          <template #append>
            <v-btn
              :disabled="!userHpEstimate"
              text
              icon
              color="go"
              @click="getSuggestions"
            >
              <v-icon>mdi-arrow-right</v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </v-form>
    </v-card-text>
    <v-expand-transition>
      <v-card-text v-if="suggestions.length">
        <p>Choose one of the HP suggestions below.</p>
        <v-btn
          v-for="suggestion in suggestions"
          :key="suggestion"
          :outlined="selection !== suggestion"
          :depressed="selection === suggestion"
          :dark="selection === suggestion"
          color="save"
          class="text-none"
          @click="updateSelection(suggestion)"
        >
          {{ hit_point_string(suggestion) }}
        </v-btn>
        <v-layout>
          <v-spacer></v-spacer>
          <v-btn text small color="grey" @click="advanced = !advanced">
            {{ advanced ? "hide advanced options" : "I need more choices" }}
          </v-btn>
        </v-layout>
        <v-expand-transition>
          <v-form v-if="advanced" @submit.prevent>
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
                    :value="adv_con"
                    label="Constitution score"
                    @input="updateAdvCon"
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-select
                    :items="sizeChoices"
                    v-model="adv_size"
                    label="Size"
                  ></v-select>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-expand-transition>
      </v-card-text>
    </v-expand-transition>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text @click="close(false)">
        <v-icon left>cancel</v-icon>
        cancel
      </v-btn>
      <v-btn
        :disabled="!selection"
        text
        color="save"
        @click="close(returnValue)"
      >
        <v-icon left>save</v-icon>
        use selection
      </v-btn>
    </v-card-actions>
  </functional-dialog-wrapper>
</template>

<script>
import functionalDialogMixin from "@/mixins/functionalDialog";
import { calculateModifier, sizeChoices } from "@/models/statblock";
import debounce from "lodash/debounce";
import FunctionalDialogWrapper from "@/components/generic/FunctionalDialogWrapper";

const size_2_die = {
  1: 4,
  2: 6,
  3: 8,
  4: 10,
  5: 12,
  6: 20,
};

export default {
  name: "CalcHitDieDialog",
  components: { FunctionalDialogWrapper },
  mixins: [functionalDialogMixin],
  props: {
    creatureSize: {
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
      adv_size: this.creatureSize,
      adv_con: this.creatureCon,
    };
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
      return size_2_die[this.advanced ? this.adv_size : this.creatureSize];
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

      this.suggestions = over === under ? [under] : [under, over];
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
