<template>
  <screen
      :items="tabs"
      class="elevation-1"
      v-model="activeTab"
  >
    <template slot="toolbar-right">
      <v-btn
          flat icon
          :disabled="activeTab <= 0"
          @click="changeTabIndex(-1)">
        <v-icon>arrow_left</v-icon>
      </v-btn>
      <span class="body-2 text-uppercase">Reorder</span>
      <v-btn
          flat icon
          :disabled="activeTab >= tabs.length - 1"
          @click="changeTabIndex(1)">
        <v-icon>arrow_right</v-icon>
      </v-btn>
      <v-btn v-if="tab.uuid" flat icon :to="{ name: routeNames.GMSCREENTAB, params: { uuid: tab.uuid }}">
        <v-icon>edit</v-icon>
      </v-btn>
      <v-btn flat icon :to="{ name: routeNames.GMSCREENTAB_CREATE }">
        <v-icon>add</v-icon>
      </v-btn>
    </template>
    <template slot="title" slot-scope="{ item }">
      {{ item.title }}
    </template>
    <screen-tab
        slot-scope="{ item }"
        :content="item.content"
    ></screen-tab>
  </screen>
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
    async changeTabIndex(direction) {
      let newIndex = this.activeTab + direction;
      let tabList = [...this.tabs];
      if (newIndex < 0 || newIndex >= tabList.length) {
        return;
      }
      let tab = tabList.splice(this.activeTab, 1)[0];
      tabList.splice(newIndex, 0, tab);
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
      this.activeTab = newIndex;
    }
  },
  async created() {
    await this.loadTabs();
  }
};
</script>
