<template>
  <v-app>
    <v-toolbar color="grey darken-3" dark dense style="flex: none">
      <v-toolbar-items>
        <v-btn
          :to="{ name: $routeNames.HOME }"
          text
          exact
          class="title no-text-dec"
        >
          <span class="hidden-xs-only">GMTOOLS</span>
          <v-icon dark class="hidden-sm-and-up">home</v-icon>
        </v-btn>
        <v-btn
          v-if="authUser.isAuthenticated"
          :to="{ name: $routeNames.ENCOUNTERS }"
          text
          class="no-text-dec hidden-xs-only"
        >
          Encounters
        </v-btn>
        <v-btn
          v-if="authUser.isAuthenticated"
          :to="{ name: $routeNames.COMBATANTS }"
          text
          class="no-text-dec hidden-xs-only"
        >
          Combatants
        </v-btn>
        <v-btn
          v-if="authUser.isAuthenticated"
          :to="{ name: $routeNames.STATBLOCKS }"
          text
          class="no-text-dec hidden-xs-only"
        >
          Statblocks
        </v-btn>
        <v-btn
          v-if="authUser.isAuthenticated"
          :to="{ name: $routeNames.CREATUREPROPS }"
          text
          class="no-text-dec hidden-xs-only"
        >
          Creature Properties
        </v-btn>
      </v-toolbar-items>

      <v-spacer></v-spacer>

      <v-toolbar-items v-if="!authUser.isAuthenticated">
        <v-btn :to="{ name: $routeNames.LOGIN }" text class="no-text-dec">
          Sign in
        </v-btn>
        <v-btn :to="{ name: $routeNames.SIGNUP }" text class="no-text-dec">
          Sign up
        </v-btn>
      </v-toolbar-items>
      <v-toolbar-items v-else>
        <template #activator="{ on }">
          <v-btn icon text v-on="on">
            <v-badge overlap>
              <template #badge>
                <span v-if="false"></span>
              </template>
              <v-icon dark>notifications</v-icon>
            </v-badge>
          </v-btn>
        </template>

        <v-menu offset-y left>
          <template #activator="{ on }">
            <v-btn text v-on="on">
              <v-icon dark>person</v-icon>
              <v-icon dark>arrow_drop_down</v-icon>
            </v-btn>
          </template>

          <v-list subheader>
            <v-list-item class="grey--text">
              <span>
                Signed in as <strong>{{ authUser.name }}</strong>
              </span>
            </v-list-item>
            <v-list-item class="grey--text">
              <span>
                Playing <strong>{{ currentCampaign.name }}</strong>
              </span>
            </v-list-item>
            <v-divider class="mt-1 mb-1"></v-divider>
            <v-list-item :to="{ name: $routeNames.CAMPAIGNS }">
              <v-list-item-action>
                <v-icon>recent_actors</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Campaigns
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: $routeNames.ACCOUNT_SETTINGS }">
              <v-list-item-action>
                <v-icon>build</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Account
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider class="mt-1 mb-1"></v-divider>
            <v-list-item @click="logout">
              <v-list-item-action>
                <v-icon>exit_to_app</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Sign out
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
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

.v-btn--icon {
  height: 36px !important;
  width: 36px !important;
  margin: 6px;
}
</style>
