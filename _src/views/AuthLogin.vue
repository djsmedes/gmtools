<template>
  <v-card :width="500" class="mx-auto">
    <v-form ref="form" @submit.stop.prevent="submit" v-model="formValid">
      <v-card-text>
        <v-text-field
          v-model="email"
          :error-messages="errors.email"
          :error-count="errors.email.length"
          label="Email"
          autofocus
          @input="[errors.email, errors.non_field_errors] = [[], []]"
        ></v-text-field>
        <v-text-field
          v-model="password"
          :error-messages="errors.password"
          :error-count="errors.password.length"
          label="Password"
          type="password"
          @input="[errors.password, errors.non_field_errors] = [[], []]"
        ></v-text-field>
        <v-expand-transition>
          <template v-if="nonFieldErrors.length">
            <v-alert
              v-for="(err, index) in nonFieldErrors"
              :key="index"
              :value="true"
              type="error"
              outline
            >
              <span v-html="err"></span>
            </v-alert>
          </template>
        </v-expand-transition>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat type="submit" color="go" :disabled="submitDisabled">
          Sign in
          <v-icon right>arrow_forward</v-icon>
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import { authActions } from "@/auth";

const noErrors = {
  non_field_errors: [],
  email: [],
  password: [],
};

export default {
  name: "AuthLogin",
  props: {
    successRoute: {
      type: Object,
      default: function() {
        return { name: this.$routeNames.HOME };
      },
    },
  },
  data() {
    return {
      email: "",
      password: "",
      errors: { ...noErrors },
      userNonActionableErrors: [],
      formValid: false,
    };
  },
  computed: {
    nonFieldErrors() {
      return [...this.userNonActionableErrors, ...this.errors.non_field_errors];
    },
    submitDisabled() {
      return Boolean(
        !this.formValid ||
          !this.email ||
          !this.password ||
          this.nonFieldErrors.length
      );
    },
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        try {
          await this.$store.dispatch(authActions.LOGIN, {
            email: this.email,
            password: this.password,
          });
          this.$router.push(this.successRoute);
        } catch (err) {
          if (err.response) {
            switch (err.response.status) {
              case 400:
                this.$set(this, "errors", {
                  ...noErrors,
                  ...err.response.data,
                });
                break;
              case 429:
                this.handleThrottleError(err.response.headers["retry-after"]);
                break;
              default:
                this.$set(this, "errors", {
                  ...noErrors,
                  non_field_errors: [
                    `Something unexpected occurred. You may want to&nbsp;<a href="${this.$route.path}">refresh the page</a>.`,
                  ],
                });
                break;
            }
          }
        }
      }
    },
    handleThrottleError(retryAfter) {
      let countdown = retryAfter;
      this.userNonActionableErrors = [
        `Too many unsuccessful attempts in a short time. You can try again in: ${countdown}`,
      ];
      let interval = setInterval(() => {
        countdown -= 1;
        this.userNonActionableErrors = [
          `Too many unsuccessful attempts in a short time. You can try again in: ${countdown}`,
        ];
      }, 1000);
      setTimeout(() => {
        clearInterval(interval);
        this.userNonActionableErrors = [];
      }, retryAfter * 1000);
    },
  },
};
</script>
