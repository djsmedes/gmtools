<template>
  <v-card>
    <v-card-title>
      Change Encounter
    </v-card-title>
    <v-card-actions>
      <v-btn flat v-if="saveFunc" @click="save">Save</v-btn>
      <v-btn flat v-if="cancelFunc" @click="cancelFunc">Cancel</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "EncounterChooser",
  props: {
    saveFunc: {
      type: Function,
      default: null
    },
    cancelFunc: {
      type: Function,
      default: null
    }
  },
  methods: {
    save() {
      // this.saveFunc
    }
  }
};
</script>
