<template>
  <div>
    <v-toolbar flat dense color="grey lighten-4">
      <v-toolbar-title class="title">{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <template v-if="editMode">
        <v-btn icon flat color="save" @click="$emit('save')">
          <v-icon>save</v-icon>
        </v-btn>
        <v-btn icon flat color="cancel" @click="$emit('cancel')">
          <v-icon>cancel</v-icon>
        </v-btn>
      </template>
      <v-btn
        v-else
        icon
        flat
        color="edit"
        @click="$emit('update:editMode', true)"
      >
        <v-icon>edit</v-icon>
      </v-btn>
    </v-toolbar>
    <v-container>
      <slot v-if="editMode || !$slots['view-only']"></slot>
      <slot name="view-only" v-else></slot>
    </v-container>
    <v-expand-transition>
      <v-layout v-if="editMode">
        <v-spacer></v-spacer>
        <v-btn flat color="save" @click="$emit('save')">
          <v-icon left>save</v-icon>
          save
        </v-btn>
        <v-btn flat color="cancel" @click="$emit('cancel')">
          <v-icon left>cancel</v-icon>
          cancel
        </v-btn>
      </v-layout>
    </v-expand-transition>
  </div>
</template>

<script>
export default {
  name: "ObjectDetailMC",
  props: {
    editMode: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
    },
  },
};
</script>
