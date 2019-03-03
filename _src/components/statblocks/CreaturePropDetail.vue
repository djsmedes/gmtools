<template>
  <v-container grid-list-xl>
    <v-form @submit.prevent v-model="formValid">
      <v-layout wrap>
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
      </v-layout>
    </v-form>
  </v-container>
</template>

<script>
import { CreatureProp } from "@/models/creatureprop";

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
