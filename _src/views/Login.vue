<template>
  <div style="max-width: 400px;" class="mx-auto">
    <form id="login-form" novalidate @submit.prevent="submitCredentials">
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
      <button class="btn btn-primary" type="submit">Log in</button>
      <div class="invalid-feedback-force-show">
        <p v-for="err in nonFieldErrors">
          {{ err }}
        </p>
      </div>
    </form>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import auth from '../auth'
  import $ from 'jquery'
  import { routeNames } from '../router'

  export default {
    name: "Login",
    props: {
      loginRedirect: {
        default: () => ({ name: routeNames.HOME })
      }
    },
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
        // loginRedirect: { name: routeNames.HOME }
      }
    },
    computed: {
      ...mapState({
        user: state => state[auth.stateKeys.USER]
      })
    },
    methods: {
      ...mapActions({
        login: auth.actionTypes.LOGIN
      }),
      submitCredentials () {
        const form = $('#login-form');
        form.removeClass('was-validated');
        if (!form[0].checkValidity()) {
          form.find(':invalid').each((index, node) => {
            this[node.id].errors.push(node.validationMessage)
          });
          form.addClass('was-validated')
        } else {
          this.login({ email: this.email.value, password: this.password.value }).then(() => {
            this.$router.push(this.loginRedirect)
          }).catch(errors => {
            this.nonFieldErrors = errors.non_field_errors;
            this.email.errors = errors.email;
            this.password.errors = errors.password;
            form.addClass('was-validated')
          })
        }
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        if (vm.user.isAuthenticated) {
          next({ name: routeNames.HOME })
        } else {
          next()
        }
      });
    },
    created () {
      // if (this.$route.props.next) this.loginRedirect = this.$route.props.next;
      console.log(this.loginRedirect)
    }
  }
</script>
