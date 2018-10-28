<template>
  <v-container fluid grid-list-md pa-0>
    <v-layout column>
      <v-flex>
        <v-card>
          <v-card-actions>
            <v-btn flat @click="save">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex>
        <screen
            :items="tabs"
            class="elevation-1 hidden-sm-and-down"
            :push-active-tab="0"
        >
          <template slot="title" slot-scope="{ item }">
            {{ item.title }}
          </template>
          <screen-tab
              slot-scope="{ item }"
              :content="item.content"
          ></screen-tab>
        </screen>
        <v-card class="hidden-md-and-up">
          <v-card-text>
            The GM screen is hidden on small screens.
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import gmscreentab from "@/models/gmscreentab";
import Screen from "@/components/gmscreen/GMScreen";
import ScreenTab from "@/components/gmscreen/GMScreenTab";

export default {
  name: "GMScreenTabList",
  components: { Screen, ScreenTab },
  computed: {
    ...mapGetters(gmscreentab.namespace, {
      tabs: gmscreentab.getterTypes.LIST
    })
  },
  methods: {
    ...mapActions(gmscreentab.namespace, {
      loadTabs: gmscreentab.actionTypes.LIST
    }),
    async save() {}
  },
  created() {
    this.loadTabs();
  }
};
</script>
