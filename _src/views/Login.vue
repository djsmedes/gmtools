<template>
  <div style="max-width: 400px;" class="mx-auto">
    <form id="login-form" novalidate @submit.prevent="submitCredentials">
      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" type="email" class="form-control" v-model="email.value" required>
        <div class="invalid-feedback">
          <p v-for="err in email.errors" :key="err">
            {{ err }}
          </p>
        </div>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input id="password" type="password" class="form-control" v-model="password.value" required>
        <div class="invalid-feedback">
          <p v-for="err in password.errors" :key="err">
            {{ err }}
          </p>
        </div>
      </div>
      <button class="btn btn-primary" type="submit">Log in</button>
      <div class="invalid-feedback-force-show">
        <p v-for="err in nonFieldErrors" :key="err">
          {{ err }}
        </p>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import auth from "../auth";
import $ from "jquery";
import { routeNames } from "../router";

export default {
  name: "Login",
  props: {
    successRoute: {
      default: () => ({ name: routeNames.HOME })
    }
  },
  data() {
    return {
      nonFieldErrors: [],
      email: {
        value: "",
        errors: []
      },
      password: {
        value: "",
        errors: []
      }
    };
  },
  methods: {
    ...mapActions(auth.namespace, {
      login: auth.actionTypes.LOGIN
    }),
    async submitCredentials() {
      const form = $("#login-form");
      form.removeClass("was-validated").removeClass("was-server-validated");
      [this.email, this.password].map(item => (item.errors = []));

      if (!form[0].checkValidity()) {
        form.find(":invalid").each((index, node) => {
          this[node.id].errors.push(node.validationMessage);
        });
        form.addClass("was-validated");
      } else {
        let errors = await this.login({
          email: this.email.value,
          password: this.password.value
        });
        if (errors) {
          this.nonFieldErrors = errors.non_field_errors;
          this.email.errors = errors.username;
          this.password.errors = errors.password;
          form.addClass("was-server-validated");
        } else {
          this.$router.push(this.successRoute);
        }
      }
    }
  }
};
</script>
