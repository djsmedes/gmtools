<template>
  <v-card :width="400" class="mx-auto">
    <v-form ref="form" @submit.stop.prevent="submit">
      <v-card-text>
        <v-alert
          v-for="(err, index) in nonFieldErrors"
          :key="index"
          :value="true"
          type="error"
        >
          {{ err }}
        </v-alert>

        <v-text-field
          v-model="email.value"
          :error-messages="email.errors"
          :rules="email.rules"
          label="Email"
        ></v-text-field>
        <v-text-field
          v-model="password1.value"
          :error-messages="password1.errors"
          :rules="password1.rules"
          label="Password"
          type="password"
        ></v-text-field>
        <v-text-field
          v-model="password2.value"
          :error-messages="password2.errors"
          :rules="password2.rules"
          label="Confirm password"
          type="password"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn flat type="submit">
          Sign up
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import { mapActions } from "vuex";
import auth from "@/auth/index";
import { routeNames } from "@/router";
import { FIELD_REQUIRED } from "@/strings/errors";

export default {
  name: "SignUp",
  data() {
    return {
      nonFieldErrors: [],
      email: {
        value: "",
        errors: [],
        rules: [v => !!v || FIELD_REQUIRED],
      },
      password1: {
        value: "",
        errors: [],
        rules: [v => !!v || FIELD_REQUIRED],
      },
      password2: {
        value: "",
        errors: [],
        rules: [
          v => !!v || "This field is required.",
          v => v === this.password1.value || "Passwords do not match.",
        ],
      },
    };
  },
  methods: {
    ...mapActions(auth.namespace, {
      signup: auth.actionTypes.SIGNUP,
    }),
    async submit() {
      if (this.$refs.form.validate()) {
        let errors = await this.signup({
          email: this.email.value,
          password1: this.password1.value,
          password2: this.password2.value,
        });
        if (!errors) {
          this.$router.push({ name: routeNames.HOME }); // todo - welcome page
        } else {
          this.nonFieldErrors = errors.non_field_errors;
          this.email.errors = errors.email;
          this.password1.errors = errors.password1;
          this.password2.errors = errors.password2;
        }
      }
    },
  },
};
</script>
