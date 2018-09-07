<template>
  <div style="max-width: 400px;" class="mx-auto">
    <form id="signup-form" novalidate @submit.prevent="submitCredentials">
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
        <label for="password1">Password</label>
        <input id="password1" type="password" class="form-control" v-model="password1.value" required>
        <div class="invalid-feedback">
          <p v-for="err in password1.errors">
            {{ err }}
          </p>
        </div>
      </div>
      <div class="form-group">
        <label for="password2">Password (again)</label>
        <input id="password2" type="password" class="form-control" v-model="password2.value" required>
        <div class="invalid-feedback">
          <p v-for="err in password2.errors">
            {{ err }}
          </p>
        </div>
      </div>
      <button class="btn btn-primary" type="submit">Sign up</button>
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
    name: 'SignUp',
    data () {
      return {
        nonFieldErrors: [],
        email: {
          value: '',
          errors: []
        },
        password1: {
          value: '',
          errors: []
        },
        password2: {
          value: '',
          errors: []
        }
      }
    },
    methods: {
      ...mapActions({
        signup: auth.actionTypes.SIGNUP
      }),
      submitCredentials () {
        const form = $('#signup-form');
        form.removeClass('was-validated');
        [this.email, this.password1, this.password2].map(item => item.errors = []);

        if (!this.password2.value.length) {
          $('#password2').get(0).setCustomValidity('Please fill out this field.');
        } else if (this.password1.value !== this.password2.value) {
          $('#password2').get(0).setCustomValidity('Passwords must match.');
        }

        if (!form[0].checkValidity()) {
          form.find(':invalid').each((index, node) => {
            this[node.id].errors.push(node.validationMessage)
          });
          form.addClass('was-validated')
        } else {
          this.signup({ email: this.email.value, password1: this.password1.value, password2: this.password2.value }).then(() => {
            this.$router.push({ name: routeNames.HOME }) // todo - welcome page
          }).catch(errors => {
            this.nonFieldErrors = errors.non_field_errors;
            this.email.errors = errors.email;
            this.password1.errors = errors.password1;
            this.password2.errors = errors.password2;
            form.addClass('was-validated')
          })
        }
      }
    }
  }
</script>
