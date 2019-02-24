<template>
  <v-dialog
    v-model="dialog"
    :max-width="width"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    persistent
    @keydown.esc="close(null)"
  >
    <v-toolbar dark color="grey darken-2" dense>
      <v-toolbar-title>Create Campaign</v-toolbar-title>
    </v-toolbar>
    <v-card tile>
      <v-card-text>
        Enter a name for your new campaign
        <v-form
          @submit.prevent="close(textFieldValue)"
          v-model="formValid"
          ref="form"
        >
          <v-text-field
            ref="firstField"
            v-model="textFieldValue"
            :rules="[v => (!!v && !!String(v).trim()) || 'Required']"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn flat @click="close(false)">
          <v-icon left>cancel</v-icon>
          cancel
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          flat
          @click="close(textFieldValue)"
          color="save"
          :disabled="!formValid"
          :loading="loading"
        >
          <v-icon left>save</v-icon>
          save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import functionalDialogMixin from "@/mixins/functionalDialog";

export default {
  name: "InvitePlayers",
  mixins: [functionalDialogMixin],
  data() {
    return {
      textFieldValue: "",
      formValid: false,
      loading: false,
    };
  },
  watch: {
    dialog(val) {
      if (val) this.$nextTick(this.$refs.firstField.focus);
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
