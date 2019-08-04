<template>
  <functional-dialog-wrapper
    v-bind="dialogAttrs"
    :title="title"
    persistent
    v-on="dialogListeners"
  >
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
  </functional-dialog-wrapper>
</template>

<script>
import functionalDialogMixin from "@/mixins/functionalDialog";
import FunctionalDialogWrapper from "@/components/generic/FunctionalDialogWrapper";

export default {
  name: "UserChoiceDialog",
  components: { FunctionalDialogWrapper },
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
};
</script>
