<template>
  <v-app>
    <v-toolbar color="grey darken-3" dark dense>
      <v-toolbar-items>
        <v-btn
          :to="{ name: $routeNames.HOME }"
          flat
          exact
          class="title no-text-dec"
        >
          <span class="hidden-xs-only">GMTOOLS</span>
          <v-icon dark class="hidden-sm-and-up">home</v-icon>
        </v-btn>
        <v-btn
          v-if="authUser.isAuthenticated"
          :to="{ name: $routeNames.ENCOUNTERS }"
          flat
          class="no-text-dec hidden-xs-only"
        >
          Encounters
        </v-btn>
        <v-btn
          v-if="authUser.isAuthenticated"
          :to="{ name: $routeNames.COMBATANTS }"
          flat
          class="no-text-dec hidden-xs-only"
        >
          Combatants
        </v-btn>
        <v-btn
          v-if="authUser.isAuthenticated"
          :to="{ name: $routeNames.STATBLOCKS }"
          flat
          class="no-text-dec hidden-xs-only"
        >
          Statblocks
        </v-btn>
        <v-btn
          v-if="authUser.isAuthenticated"
          :to="{ name: $routeNames.CREATUREPROPS }"
          flat
          class="no-text-dec hidden-xs-only"
        >
          Creature Properties
        </v-btn>
      </v-toolbar-items>

      <v-spacer></v-spacer>

      <v-toolbar-items v-if="!authUser.isAuthenticated">
        <v-btn :to="{ name: $routeNames.LOGIN }" flat class="no-text-dec">
          Sign in
        </v-btn>
        <v-btn :to="{ name: $routeNames.SIGNUP }" flat class="no-text-dec">
          Sign up
        </v-btn>
      </v-toolbar-items>
      <v-toolbar-items v-else>
        <v-btn slot="activator" icon flat>
          <v-badge overlap>
            <span v-if="false" slot="badge"></span>
            <v-icon dark>notifications</v-icon>
          </v-badge>
        </v-btn>

        <v-menu offset-y left>
          <v-btn slot="activator" flat>
            <v-icon dark>person</v-icon>
            <v-icon dark>arrow_drop_down</v-icon>
          </v-btn>

          <v-list subheader>
            <v-list-tile class="grey--text">
              <span>
                Signed in as <strong>{{ authUser.name }}</strong>
              </span>
            </v-list-tile>
            <v-list-tile class="grey--text">
              <span>
                Playing <strong>{{ currentCampaign.name }}</strong>
              </span>
            </v-list-tile>
            <v-divider class="mt-1 mb-1"></v-divider>
            <v-list-tile :to="{ name: $routeNames.CAMPAIGNS }">
              <v-list-tile-action>
                <v-icon>recent_actors</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  Campaigns
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{ name: $routeNames.ACCOUNT_SETTINGS }">
              <v-list-tile-action>
                <v-icon>build</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  Account
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider class="mt-1 mb-1"></v-divider>
            <v-list-tile @click="logout">
              <v-list-tile-action>
                <v-icon>exit_to_app</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  Sign out
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-toolbar>

    <v-content style="position: relative">
      <v-container>
        <router-view v-show="!$store.getters.isLoading" />
      </v-container>
      <v-dialog
        :value="$store.getters.isLoading"
        :width="64 + 32"
        hide-overlay
        persistent
      >
        <v-card color="grey darken-3" dark>
          <v-card-text>
            <v-progress-circular
              :size="64"
              :width="8"
              :transition="false"
              indeterminate
              color="white"
              class="mb-0"
            ></v-progress-circular>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-content>
  </v-app>
</template>

<script>
import { authActions } from "@/auth";
import { authUserMixin } from "@/mixins";

export default {
  mixins: [authUserMixin],
  methods: {
    async logout() {
      await this.$store.dispatch(authActions.LOGOUT);
      this.$router.push({ name: this.$routeNames.LOGIN });
    },
  },
};
</script>

<style lang="scss">
.no-text-dec {
  text-decoration: none !important;
}

.v-input--is-disabled:not(.disabled-means-disabled) {
  &:not(.show-affix-slots-on-disabled) {
    .v-input__prepend-outer,
    .v-input__prepend-inner,
    .v-input__append-outer,
    .v-input__append-inner {
      display: none;
    }
  }
  &:not(.show-details-on-disabled) .v-text-field__details {
    display: none;
  }
  label {
    color: rgba(0, 0, 0, 0.54) !important;
  }
  input,
  textarea,
  .v-select__selection {
    color: black !important;
  }
  & > .v-input__control > .v-input__slot::after,
  & > .v-input__control > .v-input__slot::before {
    width: 0 !important;
    border-style: solid !important;
    border-image: none !important;
  }
}

.text-monospaced textarea {
  font-family: "Monaco", courier, monospace;
}

nav.pa-0 > .v-toolbar__content {
  padding: 0;
}
</style>
