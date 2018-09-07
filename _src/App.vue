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
          <li class="nav-item">
            <router-link to="/combatants/" class="nav-link">Combatants</router-link>
          </li>
        </ul>
        <ul v-if="!user.isAuthenticated" class="navbar-nav">
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
                Signed in as <strong>{{ user.repr }}</strong>
              </span>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" href="/account/">Account options</a>
              <a class="dropdown-item" href="#" @click.prevent="logout">Sign out</a>
            </div>
          </li>
        </ul>
      </div>
    </nav>

    <div class="container">
      <router-view v-if="doneLoading"/>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import auth from './auth'
  import { routeNames } from "./router"

  export default {
    data () {
      return {
        routeNames,
        doneLoading: false
      }
    },
    computed: {
      ...mapState({
        user: auth.stateKeys.USER
      })
    },
    methods: {
      ...mapActions({
        getUser: auth.actionTypes.GET_USER,
        logoutUser: auth.actionTypes.LOGOUT
      }),
      logout () {
        this.logoutUser().then(
            this.$router.push({ name: routeNames.LOGIN })
        )
      }
    },
    created () {
      this.getUser().then(() => this.doneLoading = true)
    }
  }
</script>

<style lang="scss">
  @import "scss/shared";

  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #nav {
    a {
      font-weight: bold;
      &.router-link-active {
        color: map_get($theme-colors, 'primary');
      }
    }
  }
</style>
