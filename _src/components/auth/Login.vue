<template>
  <v-card :width="400" class="mx-auto">
    <v-card-text>
      <v-alert v-for="(err, index) in nonFieldErrors" :key="index" :value="true" type="error">
        {{ err }}
      </v-alert>
      <v-form ref="form">
        <v-text-field
            v-model="email.value"
            :error-messages="email.errors"
            :rules="email.rules"
            label="Email"
        ></v-text-field>
        <v-text-field
            v-model="password.value"
            :error-messages="password.errors"
            :rules="password.rules"
            label="Password"
            type="password"
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn flat @click="submit">
        Sign in
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions } from "vuex";
import auth from "@/auth";
import { routeNames } from "@/router";
import { FIELD_REQUIRED } from "@/strings/errors";

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
        errors: [],
        rules: [v => !!v || FIELD_REQUIRED]
      },
      password: {
        value: "",
        errors: [],
        rules: [v => !!v || FIELD_REQUIRED]
      }
    };
  },
  methods: {
    ...mapActions(auth.namespace, {
      login: auth.actionTypes.LOGIN
    }),
    async submit() {
      if (this.$refs.form.validate()) {
        let errors = await this.login({
          email: this.email.value,
          password: this.password.value
        });
        if (errors) {
          this.nonFieldErrors = errors.non_field_errors;
          this.email.errors = errors.username;
          this.password.errors = errors.password;
        } else {
          this.$router.push(this.successRoute);
        }
      }
    }
  }
};
</script>
