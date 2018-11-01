<template>
  <div>
    <v-toolbar dark color="grey darken-3" dense>
      <slot name="toolbar-left"></slot>
      <v-spacer></v-spacer>
      <v-tabs
          v-model="activeTab"
          @input="$emit('input', $event)"
          color="transparent"
          show-arrows centered grow
      >
        <v-tabs-slider
            color="white"
            v-show="activeTab !== -1"
        ></v-tabs-slider>

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
          <screen-tab :content="item.content"></screen-tab>
        </slot>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import ScreenTab from "@/components/gmscreen/GMScreenTab";

export default {
  name: "GMScreen",
  components: { ScreenTab },
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
    }
  }
};
</script>
