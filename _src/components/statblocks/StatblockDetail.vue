<template>
  <div>
    <v-tabs fixed-tabs color="transparent" v-model="whichTab">
      <v-tab>
        Edit
      </v-tab>
      <v-tab>
        Preview
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="whichTab" class="mt-3">
      <v-tab-item>
        <v-form @submit.prevent v-model="formValid">
          <v-container grid-list-xl>
            <v-layout wrap>
              <v-flex xs12 sm6>
                <v-text-field label="Name" v-model="statblock.name"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                  label="Generic name"
                  hint="This will be used in action descriptions"
                  v-model="statblock.generic_name"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm4>
                <v-text-field label="Size"></v-text-field>
              </v-flex>
              <v-flex xs12 sm4>
                <v-text-field label="Type"></v-text-field>
              </v-flex>
              <v-flex xs12 sm4>
                <v-text-field label="Alignment"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-tab-item>
      <v-tab-item>
        <statblock-view :value="statblock"></statblock-view>
      </v-tab-item>
    </v-tabs-items>

    <v-btn @click="statblock.vuex_save()">save</v-btn>
    <v-btn @click="statblock.reset()">reset</v-btn>

  </div>
</template>

<script>
import { Statblock } from "@/models/statblock_mc";
import StatblockView from "@/components/statblocks/StatblockView";

export default {
  name: "StatblockDetail",
  components: { StatblockView },
  props: {
    uuid: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      whichTab: 0,
      formValid: false,
      statblock: new Statblock({ uuid: this.uuid }),
    };
  },
  async created() {
    this.statblock.vuex_fetch(this.$store);
  },
};
</script>
