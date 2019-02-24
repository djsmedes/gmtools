<template>
  <v-slide-x-reverse-transition group tag="div">
    <v-card v-for="invite in invites" :key="invite.uuid" class="mb-3">
      <v-list two-line>
        <v-list-tile>
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
      </v-list>
    </v-card>
  </v-slide-x-reverse-transition>
</template>

<script>
import {
  load as loadInvites,
  accept as acceptInvite,
  reject as rejectInvite,
} from "@/models/invitation";

export default {
  name: "Invitations",
  data() {
    return {
      acceptWaiting: false,
      rejectWaiting: false,
      invites: [],
    };
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
  },
  async created() {
    this.invites = await loadInvites();
  },
};
</script>
