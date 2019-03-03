<template>
  <v-container grid-list-xl>
    <v-form @submit.prevent v-model="formValid">
      <v-layout wrap>
        <v-flex xs12>
          <v-select
            label="Type"
            :items="propTypeChoices"
            v-model="creatureprop.prop_type"
          ></v-select>
        </v-flex>

        <v-flex xs12>
          <v-text-field
            label="Title"
            v-model="creatureprop.title"
          ></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-textarea
            label="Description"
            v-model="creatureprop.description"
            rows="1"
            auto-grow
          ></v-textarea>
        </v-flex>

        <v-flex xs6>
          <v-text-field
            label="Save DC"
            v-model="creatureprop.save_dc_override"
          ></v-text-field>
        </v-flex>
        <v-flex xs6>
          <v-select
            label="Source Ability"
            :items="['str', 'dex', 'con', 'int', 'wis', 'cha']"
            clearable
            v-model="creatureprop.save_source_ability"
          ></v-select>
        </v-flex>
        <v-flex xs6>
          <v-select
            label="Targeted Ability"
            :items="['str', 'dex', 'con', 'int', 'wis', 'cha']"
            clearable
            v-model="creatureprop.save_ability"
          ></v-select>
        </v-flex>

        <v-flex xs12>
          <v-select
            label="Attack type"
            :items="attackTypeChoices"
            v-model="creatureprop.attack_type"
            clearable
          ></v-select>
        </v-flex>
      </v-layout>
    </v-form>
    <v-layout>
      <slot
        name="actions"
        :resetFunc="creatureprop.reset"
        :saveFunc="async () => creatureprop.vuex_save($store)"
      >
        <v-btn flat @click="creatureprop.reset()">
          <v-icon left>cancel</v-icon>
          clear changes
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn flat @click="creatureprop.vuex_save($store)" color="save">
          <v-icon left>save</v-icon>
          save
        </v-btn>
      </slot>
    </v-layout>
  </v-container>
</template>

<script>
import {
  propTypeChoices,
  attackTypeChoices,
  CreatureProp,
} from "@/models/creatureprop";

export default {
  name: "CreaturePropDetail",
  props: {
    uuid: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      propTypeChoices,
      attackTypeChoices,
      formValid: false,
      creatureprop: new CreatureProp({ uuid: this.uuid }),
    };
  },
  async created() {
    if (this.uuid) {
      this.creatureprop.vuex_fetch(this.$store);
    }
  },
};
</script>
