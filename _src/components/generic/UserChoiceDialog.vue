<template>
  <v-dialog
    v-model="dialog"
    persistent
    :max-width="width"
    @keydown.esc="close(null)"
  >
    <v-toolbar v-if="title" dark color="primary" dense>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
    </v-toolbar>
    <v-card tile>
      <v-card-text v-show="!!body" v-html="body"></v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          v-for="buttonOption in buttonList"
          :key="buttonOption.text"
          v-bind="buttonOption.attrs"
          @click="close(buttonOption.returnVal)"
        >
          {{ buttonOption.text }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import functionalDialogMixin from "@/mixins/functionalDialog";

export default {
  name: "UserChoiceDialog",
  mixins: [functionalDialogMixin],
  props: {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    buttonList: {
      type: Array,
      required: true,
    },
  },
  computed: {
    width() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "220px";
        case "sm":
          return "400px";
        case "md":
          return "500px";
        case "lg":
          return "600px";
        case "xl":
          return "800px";
      }
    },
  },
};
</script>
