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
                <v-text-field label="Name"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field label="Generic name" hint="This will be used in action descriptions"></v-text-field>
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
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import statblock, { Statblock } from "@/models/statblock";
import { routeNames } from "@/router";
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
    };
  },
  computed: {
    ...mapGetters(statblock.namespace, {
      getStatblock: statblock.getterTypes.BY_ID,
    }),
    statblock() {
      return this.getStatblock(this.uuid);
    },
  },
  methods: {
    ...mapActions(statblock.namespace, {
      loadStatblock: statblock.actionTypes.RETRIEVE,
    }),
  },
  created() {
    this.loadStatblock({ uuid: this.uuid });
  },
};
</script>
