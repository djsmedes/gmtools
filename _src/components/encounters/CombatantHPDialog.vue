<template>
  <v-dialog v-model="dialog" width="400" @keydown.esc="close(null)">
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        {{ name }}
      </v-card-title>
      <v-form>
        <v-container fluid>
          <v-layout row wrap>
            <v-flex xs4>
              <v-text-field
                type="number"
                v-model.number="returnVal.hp"
                label="Current HP"
              ></v-text-field>
            </v-flex>
            <v-flex xs4>
              <v-text-field
                type="number"
                v-model.number="returnVal.maxHp"
                label="Max HP"
              ></v-text-field>
            </v-flex>
            <v-flex xs4>
              <v-text-field
                type="number"
                v-model.number="returnVal.tempHp"
                label="Temp HP"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn flat @click="close(returnVal)">
          Save
        </v-btn>
        <v-btn flat @click="returnVal.hp = returnVal.maxHp">
          Full health
        </v-btn>
        <v-btn flat @click="close(null)">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import functionalDialog from "@/mixins/functionalDialog";

export default {
  name: "CombatantHPDialog",
  mixins: [functionalDialog],
  props: {
    name: {
      type: String,
    },
    hp: {
      type: Number,
      required: true,
    },
    maxHp: {
      type: Number,
      required: true,
    },
    tempHp: {
      typ: Number,
    },
  },
  data() {
    return {
      returnVal: {
        hp: this.hp,
        maxHp: this.maxHp,
        tempHp: this.tempHp,
      },
    };
  },
};
</script>
