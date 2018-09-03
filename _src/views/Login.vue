<template>
  <div>
    <form id="login-form" novalidate>
      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" type="email" class="form-control" v-model="email.value" required>
        <div class="invalid-feedback">
          <p v-for="err in email.errors">
            {{ err }}
          </p>
        </div>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input id="password" type="password" class="form-control" v-model="password.value" required>
        <div class="invalid-feedback">
          <p v-for="err in password.errors">
            {{ err }}
          </p>
        </div>
      </div>
      <button class="btn btn-primary" type="button" @click="submitCredentials(email.value, password.value)">Log in
      </button>
      <div class="invalid-feedback-force-show">
        <p v-for="err in nonFieldErrors">
          {{ err }}
        </p>
      </div>
    </form>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import auth from '../auth'
  import $ from 'jquery'
  import { routeNames } from '../router'

  export default {
    name: "Login",
    data () {
      return {
        nonFieldErrors: [],
        email: {
          value: '',
          errors: []
        },
        password: {
          value: '',
          errors: []
        },
      }
    },
    methods: {
      ...mapActions({
        login: auth.actionTypes.LOGIN
      }),
      submitCredentials (email, password) {
        const form = $('#login-form');
        form.removeClass('was-validated');
        if (!form[0].checkValidity()) {
          form.find(':invalid').each((index, node) => {
            this[node.id].errors.push(node.validationMessage)
          });
          form.addClass('was-validated')
        } else {
          this.login({ email, password }).then(() => {
            this.$router.push({name: routeNames.HOME})
          }).catch(errors => {
            this.nonFieldErrors = errors.non_field_errors;
            this.email.errors = errors.email;
            this.password.errors = errors.password;
            form.addClass('was-validated')
          })
        }
      }
    },
    created() {}
  }
</script>

<!--<style scoped>-->

<!--</style>-->
