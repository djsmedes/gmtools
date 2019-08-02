<template>
  <div>
    <v-toolbar dense color="transparent" flat class="pa-0">
      <v-toolbar-title class="display-1 mb-3">
        Invitations
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text color="grey" @click="toggleShowingSent">
        {{ showSent ? "see received" : "see sent" }}
      </v-btn>
    </v-toolbar>
    <v-slide-x-reverse-transition group tag="div">
      <v-card v-for="invite in invites" :key="invite.uuid" class="mb-3">
        <v-list two-line>
          <v-list-tile v-if="!showSent">
            <v-list-tile-action>
              <v-tooltip top>
                <v-btn
                  slot="activator"
                  :loading="acceptWaiting === invite.uuid"
                  icon
                  text
                  color="green"
                  @click="accept(invite)"
                >
                  <v-icon>check</v-icon>
                </v-btn>
                <span class="body-2">Accept</span>
              </v-tooltip>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>
                {{ invite.approver_external_identifier }}
              </v-list-tile-title>
              <v-list-tile-sub-title>
                Invited to
                <strong>{{ invite.campaign_name }}</strong>
              </v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-tooltip top>
                <v-btn
                  slot="activator"
                  :loading="rejectWaiting === invite.uuid"
                  icon
                  text
                  color="red"
                  @click="reject(invite)"
                >
                  <v-icon>clear</v-icon>
                </v-btn>
                <span class="body-2">Reject</span>
              </v-tooltip>
            </v-list-tile-action>
          </v-list-tile>
          <v-list-tile v-else>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ invite.joiner_external_identifier }}
              </v-list-tile-title>
              <v-list-tile-sub-title>
                Invited to
                <strong>{{ invite.campaign_name }}</strong>
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-slide-x-reverse-transition>
    <v-layout v-if="!invites.length" justify-center align-center fill-height>
      <v-flex shrink class="grey--text subheading">
        No invitations
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import {
  load as loadInvites,
  loadSent as loadSentInvites,
  accept as acceptInvite,
  reject as rejectInvite,
} from "@/models/invitation";

export default {
  name: "Invitations",
  data() {
    return {
      acceptWaiting: false,
      rejectWaiting: false,
      showSent: false,
      triedLoadingSent: false,
      receivedInvites: [],
      sentInvites: [],
    };
  },
  computed: {
    invites() {
      return this.showSent ? this.sentInvites : this.receivedInvites;
    },
  },
  async created() {
    this.receivedInvites = await loadInvites();
  },
  methods: {
    async accept(invite) {
      this.acceptWaiting = invite.uuid;
      try {
        await acceptInvite(invite);
        this.invites = this.invites.filter(i => i.uuid !== invite.uuid);
        this.$showSnack("Invitation accepted");
      } catch (err) {
        if (err.response && err.response.status >= 400) {
          this.$showSnack(
            err.response.data.detail || "An error has occurred.",
            { color: "red" }
          );
        }
      } finally {
        this.acceptWaiting = false;
      }
    },
    async reject(invite) {
      this.rejectWaiting = invite.uuid;
      try {
        await rejectInvite(invite);
        this.invites = this.invites.filter(i => i.uuid !== invite.uuid);
        this.$showSnack("Invitation rejected");
      } catch (err) {
        if (err.response && err.response.status >= 400) {
          this.$showSnack(
            err.response.data.detail || "An error has occurred.",
            { color: "red" }
          );
        }
      } finally {
        this.rejectWaiting = false;
      }
    },
    toggleShowingSent() {
      this.showSent = !this.showSent;
      if (this.showSent && !this.triedLoadingSent) {
        loadSentInvites().then(invites => (this.sentInvites = invites));
        this.triedLoadingSent = true;
      }
    },
  },
};
</script>
