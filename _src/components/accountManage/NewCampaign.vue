<template>
  <functional-dialog-wrapper
    v-bind="dialogAttrs"
    title="Create Campaign"
    v-on="dialogListeners"
  >
    <v-card-text>
      Enter a name for your new campaign
      <v-form
        ref="form"
        v-model="formValid"
        @submit.prevent="close(textFieldValue)"
      >
        <v-text-field
          ref="firstField"
          v-model="textFieldValue"
          :rules="[v => (!!v && !!String(v).trim()) || 'Required']"
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text @click="close(false)">
        <v-icon left>mdi-close-circle</v-icon>
        cancel
      </v-btn>
      <v-btn
        :disabled="!formValid"
        :loading="loading"
        text
        color="save"
        @click="close(textFieldValue)"
      >
        <v-icon left>mdi-content-save</v-icon>
        save
      </v-btn>
    </v-card-actions>
  </functional-dialog-wrapper>
</template>

<script>
import functionalDialogMixin from "@/mixins/functionalDialog";
import FunctionalDialogWrapper from "@/components/generic/FunctionalDialogWrapper";

export default {
  name: "NewCampaign",
  components: { FunctionalDialogWrapper },
  mixins: [functionalDialogMixin],
  data() {
    return {
      textFieldValue: "",
      formValid: false,
      loading: false,
    };
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
  watch: {
    async dialog(val) {
      if (val) {
        await this.$nextTick();
        this.$refs.firstField.focus();
      }
    },
  },
};
</script>
