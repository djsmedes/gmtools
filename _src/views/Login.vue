<template>
  <div>
    <div class="form-group">
      <label for="email">Email</label>
      <input id="email" type="email" class="form-control" v-model="email">
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input id="password" type="password" class="form-control" v-model="password">
    </div>
    <button class="btn btn-primary" @click="login({ email, password })">Log in</button>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  // import authApi from '../auth/api'

  export default {
    name: "Login",
    data () {
      return {
        email: '',
        password: ''
      }
    },
    methods: {
      // ...mapActions({
      //   login: authApi.actionTypes.GET_TOKEN
      // })
      login({email, password}) {
        alert('email: ' + email + ', password: ' + password)
      }
    }
  }
</script>

<!--<style scoped>-->

<!--</style>-->
