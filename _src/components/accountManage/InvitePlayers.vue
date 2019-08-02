<template>
  <v-dialog
    v-model="dialog"
    v-bind="sizeAttrs"
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
        <v-form ref="form" v-model="formValid" @submit.prevent>
          <v-combobox
            ref="emails"
            v-model="emailsToInvite"
            :append-icon="''"
            :rules="[validateEmails]"
            multiple
            chips
            hide-selected
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
          :disabled="!formValid || !emailsToInvite.length"
          :loading="loading"
          flat
          color="save"
          @click="sendInvites"
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
import { Invitation, create as createInvitation } from "@/models/invitation";
import { sleep } from "@/utils/time";

export default {
  name: "InvitePlayers",
  mixins: [functionalDialogMixin],
  props: {
    campaignUuid: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      emailsToInvite: [],
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
    dialog(val) {
      if (val) this.$nextTick(this.$refs.emails.focus);
    },
  },
  methods: {
    async sendInvites() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        try {
          await Promise.all([
            ...this.emailsToInvite.map(email =>
              createInvitation(
                new Invitation({
                  campaign: this.campaignUuid,
                  joiner_external_identifier: email,
                })
              )
            ),
            sleep(1000),
          ]);
          this.close(true);
        } catch (err) {
          if (process.env.NODE_ENV !== "production") {
            // eslint-disable-next-line
            console.warn(err);
          }
        } finally {
          this.loading = false;
        }
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
