<template>
  <div>
    <slot v-if="isLoaded"></slot>
  <v-dialog
        v-model="stillLoading"
        hide-overlay persistent
        :width="64 + 32">
      <v-card color="grey darken-3" dark>
        <v-card-text>
          <v-progress-circular
              :size="64"
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
  },
  computed: {
    stillLoading() {
      return !this.isLoaded;
    }
  }
};
</script>
