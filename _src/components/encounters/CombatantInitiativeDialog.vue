<template>
  <functional-dialog-wrapper
    v-bind="dialogAttrs"
    :title="`Initiative: ${name}`"
    v-on="dialogListeners"
  >
    <v-card-text v-if="rolling" class="text-center">
      <v-progress-circular indeterminate></v-progress-circular>
    </v-card-text>
    <v-card-text v-else-if="roll">
      <span class="title">
        You rolled: {{ roll + initiativeBonus }} ({{ roll }} +
        {{ initiativeBonus }})
      </span>
    </v-card-text>
    <v-form v-else>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs6>
            <v-text-field
              v-model="returnVal.initiativeBonus"
              type="number"
              pattern="\d*"
              label="Initiative Bonus"
            ></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field
              v-model="returnVal.initiative"
              type="number"
              pattern="\d*"
              label="Initiative"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text @click="close(null)">
        <v-icon left>mdi-close-circle</v-icon>
        {{ roll ? "Ignore" : "Cancel" }}
      </v-btn>
      <v-btn :disabled="!!roll" text @click="rollInitiative">
        <v-icon left>mdi-dice-d20</v-icon>
        Roll
      </v-btn>
      <v-btn text color="save" @click="close(returnVal)">
        <v-icon left>mdi-content-save</v-icon>
        Save
      </v-btn>
    </v-card-actions>
  </functional-dialog-wrapper>
</template>

<script>
import functionalDialog from "@/mixins/functionalDialog";
import { sleep } from "@/utils/time";
import FunctionalDialogWrapper from "@/components/generic/FunctionalDialogWrapper";

export default {
  name: "CombatantInitiativeDialog",
  components: { FunctionalDialogWrapper },
  mixins: [functionalDialog],
  props: {
    name: {
      type: String,
      required: true,
    },
    initiative: {
      type: Number,
      default: 0,
    },
    initiativeBonus: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      returnVal: {
        initiative: this.initiative,
        initiativeBonus: this.initiativeBonus,
      },
      roll: null,
      rolling: false,
    };
  },
  methods: {
    async rollInitiative() {
      this.rolling = true;
      await sleep(750);
      // todo - die roll function
      this.roll = ((Math.random() * 20) | 0) + 1;
      this.returnVal.initiative = this.roll + this.initiativeBonus;
      this.rolling = false;
    },
  },
};
</script>
