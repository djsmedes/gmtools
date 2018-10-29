<template>
  <div>
    <v-toolbar dark color="grey darken-3" dense>
      <v-tabs
          v-model="activeTab"
          @input="$emit('input', $event)"
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
      <v-spacer></v-spacer>
      <slot name="toolbar-right"></slot>

    </v-toolbar>
    <v-tabs-items :value="activeTab">
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
    },
    value: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      activeTab: this.value,
      tabsSliderStyle: ""
    };
  },
  watch: {
    value(newVal) {
      this.activeTab = newVal;
    },
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
