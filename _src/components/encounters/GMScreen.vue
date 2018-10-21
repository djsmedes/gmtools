<template>
  <div>
    <v-toolbar dark color="grey darken-3" dense>
      <v-tabs
          v-model="tabs"
          color="transparent"
          slider-color="white">
        <v-tab
            v-for="(item, index) in items"
            :key="index">
          <slot :item="item" name="title">
            {{ item.title }}
          </slot>
        </v-tab>
      </v-tabs>

    </v-toolbar>
    <v-tabs-items v-model="tabs">
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
      tabs: 0
    };
  }
};
</script>
