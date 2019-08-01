<template>
  <div>
    <v-toolbar color="grey lighten-3" dense flat>
      <v-tabs v-model="activeTab" color="transparent" slider-color="black">
        <v-tab v-for="(item, index) in tabList.models" :key="index">
          {{ item.title }}
        </v-tab>
      </v-tabs>
      <v-spacer></v-spacer>
      <v-btn flat icon :disabled="activeTab <= 0" @click="changeTabIndex(-1)">
        <v-icon>arrow_left</v-icon>
      </v-btn>
      <span
        class="body-2 text-uppercase"
        :style="{
          cursor: 'default',
        }"
      >
        Reorder
      </span>
      <v-btn
        flat
        icon
        :disabled="activeTab >= tabList.models.length - 1"
        @click="changeTabIndex(1)"
      >
        <v-icon>arrow_right</v-icon>
      </v-btn>
      <v-btn
        v-if="tab.uuid"
        flat
        icon
        :to="{ name: $routeNames.GMSCREENTAB, params: { uuid: tab.uuid } }"
      >
        <v-icon>edit</v-icon>
      </v-btn>
      <v-btn v-else flat icon disabled>
        <v-icon>edit</v-icon>
      </v-btn>
      <v-btn flat icon :to="{ name: $routeNames.GMSCREENTAB_CREATE }">
        <v-icon>add</v-icon>
      </v-btn>
    </v-toolbar>
    <v-tabs-items :value="activeTab">
      <v-tab-item v-for="(item, index) in tabList.models" :key="index">
        <screen-tab :content="item.content"></screen-tab>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import ScreenTab from "@/components/gmscreen/GMScreenTab";
import { GMScreenTab, GMScreenTabList } from "@/models";

export default {
  name: "GMScreen",
  components: { ScreenTab },
  data() {
    return {
      tabList: new GMScreenTabList(),
      activeTab: 0,
    };
  },
  computed: {
    tab() {
      return this.tabList.models[this.activeTab] || new GMScreenTab();
    },
  },
  async created() {
    await this.tabList.fetch();
    this.tabList.sort("order");
  },
  methods: {
    async changeTabIndex(direction) {
      let oldIndex = this.activeTab;
      let newIndex = oldIndex + direction;
      if (newIndex < 0 || newIndex >= this.tabList.models.length) {
        return;
      }
      let promises = [];
      this.tabList.models.forEach((tab, index) => {
        if (index === oldIndex) {
          tab.order = newIndex;
        } else if (index === newIndex) {
          tab.order = oldIndex;
        } else {
          tab.order = index;
        }
        if (tab.changed()) {
          promises.push(tab.save());
        }
      });
      await Promise.all(promises);
      this.tabList.sort("order");
      this.activeTab = newIndex;
    },
  },
};
</script>
