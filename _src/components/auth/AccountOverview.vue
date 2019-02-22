<template>
  <v-layout wrap>
    <v-flex shrink>
      <v-card max-width="800">
        <v-card-title class="title">Invitations</v-card-title>
        <v-list two-line>
          <template v-for="(invite, index) in invites">
            <v-divider :key="invite.uuid" v-if="index > 0"></v-divider>
            <v-list-tile :key="invite.uuid">
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ invite.campaign_name }}
                </v-list-tile-title>
                <v-list-tile-sub-title>
                  Invited by <strong>{{ invite.approver_external_identifier }}</strong>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-tooltip top>
                  <v-btn slot="activator" icon flat color="green">
                    <v-icon>check</v-icon>
                  </v-btn>
                  <span class="body-2">Accept</span>
                </v-tooltip>
              </v-list-tile-action>
              <v-list-tile-action>
                <v-tooltip top>
                  <v-btn slot="activator" icon flat color="red">
                    <v-icon>clear</v-icon>
                  </v-btn>
                  <span class="body-2">Reject</span>
                </v-tooltip>
              </v-list-tile-action>
            </v-list-tile>
          </template>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { Invitation, load as loadInvites } from "@/models/invitation";

export default {
  name: "AccountOverview",
  data() {
    return {
      invites: [
        { uuid: 1, campaign_name: "Bob's Campaign", inviter_name: "Bob" },
        { uuid: 2, campaign_name: "Joe's Campaign", inviter_name: "Joe" },
      ],
    };
  },
  async created() {
    this.invites = await loadInvites();
  },
};
</script>
