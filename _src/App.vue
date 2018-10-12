<template>
  <v-app>
    <v-toolbar color="grey darken-3" dark dense>
      <v-toolbar-items>
        <v-btn flat exact class="title no-text-dec"
               :to="{name: routeNames.HOME}">
          GMTOOLS
        </v-btn>
        <v-btn flat v-if="isAuthenticated"
               class="no-text-dec"
               :to="{name: routeNames.CAMPAIGNS}">
          Campaigns
        </v-btn>
        <v-btn flat v-if="isAuthenticated"
               class="no-text-dec"
               :to="{name: routeNames.COMBATANTS}">
          Combatants
        </v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="!isAuthenticated">
        <v-btn flat class="no-text-dec"
               :to="{name: routeNames.LOGIN}">
          Sign in
        </v-btn>
        <v-btn flat class="no-text-dec"
               :to="{name: routeNames.SIGNUP}">
          Sign up
        </v-btn>
      </v-toolbar-items>
      <v-toolbar-items v-else>
        <v-menu>
          <v-btn slot="activator" flat>
            <span>{{ user.email }}</span>
            <v-icon dark>arrow_drop_down</v-icon>
          </v-btn>

          <v-list dense subheader>
            <v-list-tile class="grey--text">
              <span>Signed in as <strong>{{ user.name }}</strong></span>
            </v-list-tile>
            <v-divider class="mt-1 mb-1"></v-divider>
            <v-subheader>
              Campaigns
            </v-subheader>
            <v-list-tile @click.stop
                         v-for="campaign in campaignsByUser(user.uuid)"
                         :key="campaign.uuid">


              <v-list-tile-content @click="setCurrentCampaign(campaign.uuid)">
                <v-list-tile-title>{{ campaign.name }}</v-list-tile-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-icon v-if="campaign.uuid === user.current_campaign">
                  location_on
                </v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider class="mt-1 mb-1"></v-divider>
            <v-list-tile @click="$router.push({name: routeNames.ACCOUNT_SETTINGS})">
              Account
            </v-list-tile>
            <v-list-tile @click="logout">
              Sign out
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-toolbar>

    <v-container fluid>
      <router-view v-if="isRequested"/>
    </v-container>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import auth from "@/auth";
import { routeNames } from "@/router";
import userModule, { User } from "@/models/user";
import campaignModule from "@/models/campaign";

export default {
  data() {
    return {
      routeNames
    };
  },
  computed: {
    ...mapGetters(auth.namespace, {
      user: auth.getterTypes.AUTH_USER,
      isAuthenticated: auth.getterTypes.IS_USER_AUTHENTICATED,
      isRequested: auth.getterTypes.WAS_AUTH_USER_REQUESTED
    }),
    ...mapGetters(campaignModule.namespace, {
      campaignById: campaignModule.getterTypes.BY_ID,
      campaignsByUser: campaignModule.getterTypes.BY_USER
    })
  },
  methods: {
    ...mapActions(auth.namespace, {
      logoutUser: auth.actionTypes.LOGOUT
    }),
    ...mapActions(userModule.namespace, {
      updateUser: userModule.actionTypes.UPDATE
    }),
    ...mapActions(campaignModule.namespace, {
      loadCampaigns: campaignModule.actionTypes.LIST
    }),
    logout() {
      this.logoutUser();
      this.$router.push({ name: routeNames.LOGIN });
    },
    async setCurrentCampaign(uuid) {
      await this.updateUser(new User({ ...this.user, current_campaign: uuid }));
    }
  }
};
</script>

<style lang="scss">
@import "./scss/shared";

.no-text-dec {
  text-decoration: none !important;
}
</style>
