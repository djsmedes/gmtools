<template>
  <v-container fluid grid-list-md pa-0>
    <v-layout column>
      <v-flex>
        <v-card>
          <v-card-actions>
            <v-btn
                flat icon
                :disabled="activeTab <= 0"
                @click="changeTabIndex(-1)">
              <v-icon>arrow_left</v-icon>
            </v-btn>
            <span class="body-2 text-uppercase">Move selected tab</span>
            <v-btn
                flat icon
                :disabled="activeTab >= tabs.length - 1"
                @click="changeTabIndex(1)">
              <v-icon>arrow_right</v-icon>
            </v-btn>
            <v-btn v-if="tab.uuid" flat :to="{ name: routeNames.GMSCREENTAB, params: { uuid: tab.uuid }}">
              Edit selected tab
            </v-btn>
            <v-btn flat :to="{ name: routeNames.GMSCREENTAB_CREATE }">
              Create new tab
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex>
        <screen
            :items="tabs"
            class="elevation-1 hidden-sm-and-down"
            v-model="activeTab"
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
import gmscreentab, { GMScreenTab } from "@/models/gmscreentab";
import Screen from "@/components/gmscreen/GMScreen";
import ScreenTab from "@/components/gmscreen/GMScreenTab";
import { routeNames } from "@/router";

export default {
  name: "GMScreenTabList",
  components: { Screen, ScreenTab },
  data() {
    return {
      routeNames,
      activeTab: 0
    };
  },
  computed: {
    ...mapGetters(gmscreentab.namespace, {
      tabs: gmscreentab.getterTypes.LIST
    }),
    tab() {
      return this.tabs[this.activeTab] || new GMScreenTab();
    }
  },
  methods: {
    ...mapActions(gmscreentab.namespace, {
      loadTabs: gmscreentab.actionTypes.LIST,
      updateTab: gmscreentab.actionTypes.UPDATE
    }),
    async save(tabList) {
      let index = 0;
      await Promise.all(
        tabList.reduce((acc, cur) => {
          if (cur.order !== index) {
            acc.push(this.updateTab({ ...cur, order: index }));
          }
          index += 1;
          return acc;
        }, [])
      );
    },
    async changeTabIndex(direction) {
      let newIndex = this.activeTab + direction;
      let tabList = [...this.tabs];
      if (newIndex < 0 || newIndex >= tabList.length) {
        return;
      }
      let tab = tabList.splice(this.activeTab, 1)[0];
      tabList.splice(newIndex, 0, tab);
      await this.save(tabList);
      this.activeTab = newIndex;
    }
  },
  async created() {
    await this.loadTabs();
  }
};
</script>
