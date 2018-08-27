<template>
  <div id="app">
    <nav id="nav" class="navbar navbar-expand-lg navbar-dark bg-dark mb-2">
      <router-link to="/" class="navbar-brand">GMTOOLS</router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link to="/about" class="nav-link">About</router-link>
          </li>
        </ul>
        <ul v-if="!user" class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" href="/account/login/">Sign in</a>
          </li>
          <li class="navbar-text">
            or
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/account/signup/">Sign up</a>
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
              <a class="dropdown-item" href="/account/logout/">Sign out</a>
            </div>
          </li>
        </ul>
      </div>
    </nav>

    <div class="container">
      <router-view/>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    computed: {
      ...mapState([
        'user'
      ])
    },
    created() {
      this.$store.dispatch({
        type: 'get_user',
      });
    }
  }
</script>

<style lang="scss">
  @import "scss/custom";

  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #nav {
    a {
      font-weight: bold;
      &.router-link-exact-active {
        color: map_get($theme-colors, 'primary');
      }
    }
  }
</style>
