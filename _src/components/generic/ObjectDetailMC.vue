<template>
  <div>
    <v-toolbar flat dense color="grey lighten-4">
      <v-toolbar-title class="title">{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <template v-if="editMode">
        <v-btn icon text color="save" @click="$emit('save')">
          <v-icon>save</v-icon>
        </v-btn>
        <v-btn icon text color="cancel" @click="$emit('cancel')">
          <v-icon>cancel</v-icon>
        </v-btn>
      </template>
      <v-btn
        v-else
        icon
        text
        color="edit"
        @click="$emit('update:editMode', true)"
      >
        <v-icon>edit</v-icon>
      </v-btn>
    </v-toolbar>
    <v-container>
      <slot v-if="editMode || !$slots['view-only']"></slot>
      <slot v-else name="view-only"></slot>
    </v-container>
    <v-expand-transition>
      <v-layout v-if="editMode">
        <v-btn
          v-bind="deleteAttrs"
          text
          color="delete"
          @click="$emit('delete')"
        >
          <v-icon left>delete</v-icon>
          delete
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn v-bind="saveAttrs" text color="save" @click="$emit('save')">
          <v-icon left>save</v-icon>
          save
        </v-btn>
        <v-btn
          v-bind="cancelAttrs"
          text
          color="cancel"
          @click="$emit('cancel')"
        >
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
      default: "",
    },
    deleteAttrs: {
      type: Object,
      default: () => ({}),
    },
    saveAttrs: {
      type: Object,
      default: () => ({}),
    },
    cancelAttrs: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>
