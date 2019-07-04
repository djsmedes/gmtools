<template>
  <v-card>
    <v-toolbar dark color="grey darken-3" dense>
      <v-tabs v-model="activeTab" color="transparent" show-arrows>
        <v-tabs-slider color="white"></v-tabs-slider>

        <v-tab
          v-for="(item, index) in tabs"
          :key="index"
          :ref="'tab_' + index"
          :disabled="item.disabled"
        >
          <slot :item="item" name="title">
            <template v-if="index">
              {{ item.title }}
            </template>
            <template v-else>
              <v-icon>settings</v-icon>
            </template>
          </slot>
        </v-tab>
      </v-tabs>
      <v-spacer></v-spacer>
      <v-btn flat icon :disabled="activeTab <= 1" @click="changeTabIndex(-1)">
        <v-icon>arrow_left</v-icon>
      </v-btn>
      <span
        class="body-2 text-uppercase"
        :style="{
          cursor: 'default',
          opacity: !activeTab ? '0.7' : undefined,
        }"
      >
        Reorder
      </span>
      <v-btn
        flat
        icon
        :disabled="activeTab >= tabs.length - 1 || !activeTab"
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
      <v-tab-item v-for="(item, index) in tabs" :key="index">
        <slot :item="item">
          <slot v-if="!index" name="pageSettings"></slot>
          <screen-tab v-else :content="item.content"></screen-tab>
        </slot>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
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
    tabs() {
      return [0, ...this.tabList.models];
    },
    tab() {
      return this.tabList.models[this.activeTab - 1] || new GMScreenTab();
    },
  },
  async created() {
    await this.tabList.fetch();
    this.tabList.sort("order");
  },
  methods: {
    async changeTabIndex(direction) {
      // caution: touching this is ASKING for an off-by-one error
      let oldIndex = this.activeTab - 1;
      let newIndex = oldIndex + direction;
      let tabList = [...this.tabList.models];
      if (newIndex < 0 || newIndex >= tabList.length) {
        return;
      }
      let tab = tabList.splice(oldIndex, 1)[0];
      tabList.splice(newIndex, 0, tab);
      let promises = [];
      tabList.forEach((tab, index) => {
        if (tab.order !== index + 1) {
          tab.order = index + 1;
          promises.push(tab.save());
        }
      });
      await Promise.all(promises);
      this.tabList.sort("order");
      this.activeTab = newIndex + 1;
    },
  },
};
</script>
