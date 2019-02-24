<template>
  <v-dialog
    v-model="dialog"
    :max-width="width"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    persistent
    @keydown.esc="close(null)"
  >
    <v-toolbar dark color="grey darken-2" dense>
      <v-toolbar-title>Invite Players</v-toolbar-title>
    </v-toolbar>
    <v-card tile>
      <v-card-text>
        Type an email address, then press &nbsp;<kbd>enter</kbd>&nbsp; or
        &nbsp;<kbd>tab</kbd>&nbsp; to enter more.
        <v-form @submit.prevent v-model="formValid" ref="form">
          <v-combobox
            ref="emails"
            multiple
            v-model="emailsToInvite"
            chips
            hide-selected
            :append-icon="''"
            :rules="[validateEmails]"
            validate-on-blur
          >
          </v-combobox>
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
          @click="sendInvites"
          color="save"
          :disabled="!formValid || !emailsToInvite.length"
        >
          <v-icon left>send</v-icon>
          send invites
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
      emailsToInvite: [],
      formValid: false,
    };
  },
  watch: {
    dialog(val) {
      if (val) this.$nextTick(this.$refs.emails.focus);
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
  methods: {
    sendInvites() {
      if (this.$refs.form.validate()) {
        console.log(this.emailsToInvite);
        this.close(true);
      }
    },
    validateEmails(emailList) {
      let badEmails = emailList.filter(
        email => !/^[^\s]+@[^\s]+\.[^\s]+$/.test(email)
      );
      if (badEmails.length) {
        return (
          "These don't seem to be valid email addresses: " +
          badEmails.join(", ")
        );
      } else {
        return true;
      }
    },
  },
};
</script>
