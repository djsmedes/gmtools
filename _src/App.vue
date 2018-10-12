<template>
  <div id="app">
    <nav id="nav" class="navbar navbar-expand-lg navbar-dark bg-dark mb-2">
      <router-link to="/" class="navbar-brand" exact>GMTOOLS</router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li v-if="isAuthenticated" class="nav-item">
            <router-link :to="{name: routeNames.CAMPAIGNS}" class="nav-link">Campaigns</router-link>
          </li>
          <li v-if="isAuthenticated" class="nav-item">
            <router-link :to="{name: routeNames.COMBATANTS}" class="nav-link">Combatants</router-link>
          </li>
        </ul>
        <ul v-if="!isAuthenticated" class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link" :to="{name: routeNames.LOGIN}">Sign in</router-link>
          </li>
          <li class="navbar-text">
            or
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{name: routeNames.SIGNUP}">Sign up</router-link>
          </li>
        </ul>
        <ul v-else class="navbar-nav">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="UserDropdown" role="button" data-toggle="dropdown"
               aria-haspopup="true" aria-expanded="false">
              {{ user.email }}
            </a>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="UserDropdown">
              <span class="dropdown-item-text text-muted">
                Signed in as <strong>{{ user.name }}</strong>
              </span>
              <div class="dropdown-divider"></div>
              <h6 class="dropdown-header">Campaigns</h6>
              <a v-for="campaign in campaignsByUser(user.uuid)"
                 class="dropdown-item"
                 :class="[{active: campaign.uuid === user.current_campaign}]"
                 href="#"
                 @click.prevent.stop="setCurrentCampaign(campaign.uuid)"
                 :key="campaign.uuid">
                {{ campaign.name }}
              </a>
              <div class="dropdown-divider"></div>
              <router-link class="dropdown-item" :to="{name: routeNames.ACCOUNT_SETTINGS}">Account options</router-link>
              <a class="dropdown-item" href="#" @click.prevent="logout">Sign out</a>
            </div>
          </li>
        </ul>
      </div>
    </nav>

    <div class="container">
      <router-view v-if="isRequested"/>
    </div>
  </div>
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
@import "scss/shared";

#nav {
  a {
    font-weight: bold;
    &.router-link-active {
      color: map_get($theme-colors, "primary");
    }
  }
}
</style>
