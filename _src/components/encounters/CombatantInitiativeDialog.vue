<template>
  <v-dialog
    v-model="dialog"
    width="400"
    @keydown.esc="close(null)"
    :persistent="roll !== null"
  >
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        {{ name }}
      </v-card-title>
      <v-card-text v-if="rolling" class="text-xs-center">
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
          <v-layout row wrap>
            <v-flex xs6>
              <v-text-field
                type="number"
                pattern="\d*"
                v-model="returnVal.initiativeBonus"
                label="Initiative Bonus"
              ></v-text-field>
            </v-flex>
            <v-flex xs6>
              <v-text-field
                type="number"
                pattern="\d*"
                v-model="returnVal.initiative"
                label="Initiative"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
      <v-card-actions>
        <v-btn flat @click="close(returnVal)">
          Save
        </v-btn>
        <v-btn flat :disabled="!!roll" @click="rollInitiative">
          Roll
        </v-btn>
        <v-btn flat @click="close(null)">
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
    },
    initiative: {
      type: Number,
    },
    initiativeBonus: {
      type: Number,
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
      this.roll = ((Math.random() * 20) | 0) + 1;
      this.returnVal.initiative = this.roll + this.initiativeBonus;
      this.rolling = false;
    },
  },
};
</script>
