<template>
  <v-dialog
    v-model="dialog"
    :persistent="roll !== null"
    width="400"
    @keydown.esc="close(null)"
  >
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        {{ name }}
      </v-card-title>
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
        <v-container fluid>
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
        <v-btn text @click="close(returnVal)">
          Save
        </v-btn>
        <v-btn :disabled="!!roll" text @click="rollInitiative">
          Roll
        </v-btn>
        <v-btn text @click="close(null)">
          {{ roll ? "Ignore" : "Cancel" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import functionalDialog from "@/mixins/functionalDialog";
import { sleep } from "@/utils/time";

export default {
  name: "CombatantInitiativeDialog",
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
