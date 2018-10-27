<template>
  <div>
    <v-toolbar dark color="grey darken-3" dense>
      <v-tabs
          v-model="activeTab"
          color="transparent"
      >
        <v-tabs-slider color="white" :style="tabsSliderStyle" ></v-tabs-slider>
        <v-tab
            v-for="(item, index) in items"
            :key="index"
            :ref="'tab_' + index"
            :disabled="item.disabled"
        >
          <slot :item="item" name="title">
            {{ item.title }}
          </slot>
        </v-tab>
      </v-tabs>

    </v-toolbar>
    <v-tabs-items v-model="activeTab">
      <v-tab-item
          v-for="(item, index) in items"
          :key="index">
        <slot :item="item">
          {{ item.content }}
        </slot>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
export default {
  name: "GMScreen",
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      activeTab: 0,
      tabsSliderStyle: ""
    };
  },
  watch: {
    activeTab() {
      this.tabsSliderStyle = "";
    },
    items() {
      this.$nextTick(() => {
        let width = this.$refs["tab_" + this.activeTab][0].$el.clientWidth;
        this.tabsSliderStyle = "width: " + width + "px;";
      });
    }
  }
};
</script>
