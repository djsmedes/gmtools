<template>
  <div>
    <div v-if="$store.getters.isLoading" class="loading-overlay"></div>
    <div v-show="!$store.getters.isLoading">
      <slot></slot>
    </div>
  <v-dialog
        :value="$store.getters.isLoading"
        hide-overlay persistent
        :width="64 + 32">
      <v-card color="grey darken-3" dark>
        <v-card-text>
          <v-progress-circular
              :size=64
              :width=8
              :transition=false
              indeterminate
              color="white"
              class="mb-0"
          ></v-progress-circular>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "DisplayWhenLoaded",
  props: {
    isLoaded: {
      type: Boolean,
      default: true
    }
  }
};
</script>

<style scoped lang="scss">
.loading-overlay {
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.3);
}
</style>
