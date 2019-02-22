<template>
  <v-layout wrap>
    <v-flex shrink>
      <v-card width="450">
        <v-card-title class="title">Invitations</v-card-title>
        <v-slide-x-reverse-transition group tag="v-list" two-line>
          <template v-for="(invite, index) in invites">
            <v-divider :key="invite.uuid" v-if="index > 0"></v-divider>
            <v-list-tile :key="invite.uuid">
              <v-list-tile-action>
                <v-tooltip top>
                  <v-btn
                    slot="activator"
                    icon
                    flat
                    color="green"
                    :loading="acceptWaiting === invite.uuid"
                    @click="accept(invite)"
                  >
                    <v-icon>check</v-icon>
                  </v-btn>
                  <span class="body-2">Accept</span>
                </v-tooltip>
              </v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>
                  {{ invite.campaign_name }}
                </v-list-tile-title>
                <v-list-tile-sub-title>
                  Invited by
                  <strong>{{ invite.approver_external_identifier }}</strong>
                </v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-tooltip top>
                  <v-btn
                    slot="activator"
                    icon
                    flat
                    color="red"
                    :loading="rejectWaiting === invite.uuid"
                    @click="reject(invite)"
                  >
                    <v-icon>clear</v-icon>
                  </v-btn>
                  <span class="body-2">Reject</span>
                </v-tooltip>
              </v-list-tile-action>
            </v-list-tile>
          </template>
        </v-slide-x-reverse-transition>
      </v-card>
    </v-flex>

    <v-snackbar v-model="snack" bottom :color="snackColor" :timeout="6000">
      {{ snackMsg }}
      <v-btn icon flat @click="snack = false">
        <v-icon>close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-layout>
</template>

<script>
import {
  Invitation,
  load as loadInvites,
  accept as acceptInvite,
  reject as rejectInvite,
} from "@/models/invitation";
import { sleep } from "@/utils/time";

export default {
  name: "AccountOverview",
  data() {
    return {
      acceptWaiting: false,
      rejectWaiting: false,
      invites: [],
      snack: false,
      snackMsg: "",
      snackColor: undefined,
    };
  },
  methods: {
    openSnack(message, asError = false) {
      this.snackColor = asError ? "red" : undefined;
      this.snackMsg = message;
      this.snack = true;
    },
    async accept(invite) {
      this.acceptWaiting = invite.uuid;
      try {
        await acceptInvite(invite);
        this.invites = this.invites.filter(i => i.uuid !== invite.uuid);
        this.openSnack("Invitation accepted");
      } catch (err) {
        if (err.response && err.response.status >= 400) {
          this.openSnack(
            err.response.data.detail || "An error has occurred.",
            true
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
        this.openSnack("Invitation rejected");
      } catch (err) {
        if (err.response && err.response.status >= 400) {
          this.openSnack(
            err.response.data.detail || "An error has occurred.",
            true
          );
        }
      } finally {
        this.rejectWaiting = false;
      }
    },
  },
  async created() {
    this.invites = await loadInvites();
  },
};
</script>
