<template>
  <functional-dialog-wrapper
    v-bind="dialogAttrs"
    :title="name"
    v-on="dialogListeners"
  >
    <v-form>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs4>
            <v-text-field
              v-model.number="returnVal.hp"
              type="number"
              label="Current HP"
            ></v-text-field>
          </v-flex>
          <v-flex xs4>
            <v-text-field
              v-model.number="returnVal.maxHp"
              type="number"
              label="Max HP"
            ></v-text-field>
          </v-flex>
          <v-flex xs4>
            <v-text-field
              v-model.number="returnVal.tempHp"
              type="number"
              label="Temp HP"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text color="save" @click="close(returnVal)">
        <v-icon left>save</v-icon>
        Save
      </v-btn>
      <v-btn text color="red darken-2" @click="returnVal.hp = returnVal.maxHp">
        <v-icon left>mdi-arrow-collapse-up</v-icon>
        Full health
      </v-btn>
      <v-btn text @click="close(null)">
        <v-icon left>cancel</v-icon>
        Cancel
      </v-btn>
    </v-card-actions>
  </functional-dialog-wrapper>
</template>

<script>
import functionalDialog from "@/mixins/functionalDialog";
import FunctionalDialogWrapper from "@/components/generic/FunctionalDialogWrapper";

export default {
  name: "CombatantHPDialog",
  components: { FunctionalDialogWrapper },
  mixins: [functionalDialog],
  props: {
    name: {
      type: String,
      default: "",
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
      type: Number,
      default: 0,
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
