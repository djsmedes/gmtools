<template>
  <v-card :width="500" class="mx-auto">
    <v-form ref="form" @submit.stop.prevent="submit" v-model="formValid">
      <v-card-text>
        <v-text-field
          v-model="email.value"
          :error-messages="email.errors"
          :rules="email.rules"
          label="Email"
          autofocus
        ></v-text-field>
        <v-text-field
          v-model="password.value"
          :error-messages="password.errors"
          :rules="password.rules"
          label="Password"
          type="password"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <template v-if="nonFieldErrors.length">
          <v-alert :value="true" type="error" outline>
            {{ nonFieldErrors[0] }}
          </v-alert>
        </template>
        <v-spacer></v-spacer>
        <v-btn flat type="submit" color="go" :disabled="!formValid">
          Sign in
          <v-icon right>arrow_forward</v-icon>
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import { authActions } from "@/auth";
import { FIELD_REQUIRED } from "@/strings/errors";

export default {
  name: "AuthLogin",
  props: {
    successRoute: {
      default: function() {
        return { name: this.$routeNames.HOME };
      },
    },
  },
  data() {
    return {
      formValid: false,
      nonFieldErrors: [],
      email: {
        value: "",
        errors: [],
        rules: [v => !!v || FIELD_REQUIRED],
      },
      password: {
        value: "",
        errors: [],
        rules: [v => !!v || FIELD_REQUIRED],
      },
    };
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        let errors = await this.$store.dispatch(authActions.LOGIN, {
          email: this.email.value,
          password: this.password.value,
        });
        if (errors) {
          this.nonFieldErrors = errors.non_field_errors;
          this.email.errors = errors.username;
          this.password.errors = errors.password;
        } else {
          this.$router.push(this.successRoute);
        }
      }
    },
  },
};
</script>
