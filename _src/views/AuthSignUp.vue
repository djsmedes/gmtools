<template>
  <v-card :width="500" class="mx-auto">
    <v-form ref="form" v-model="formValid" @submit.stop.prevent="submit">
      <v-card-text>
        <v-text-field
          v-model="email"
          :error-messages="errors.email"
          :error-count="errors.email.length + 1"
          :rules="[validEmailNaive]"
          label="Email"
          validate-on-blur
          @input="[errors.email, errors.non_field_errors] = [[], []]"
        ></v-text-field>
        <v-text-field
          v-model="password1"
          :messages="
            errors.password1.length
              ? errors.password1
              : passwordRequirementTexts
          "
          :error="!!errors.password1.length"
          :error-count="
            Math.max(errors.password1.length, passwordRequirementTexts.length)
          "
          label="Password"
          type="password"
          @input="[errors.password1, errors.non_field_errors] = [[], []]"
          @blur="validatePasswordNaive"
        ></v-text-field>
        <v-text-field
          v-model="password2"
          :error-messages="errors.password2"
          :error-count="errors.password2.length"
          label="Confirm password"
          type="password"
          @input="[errors.password2, errors.non_field_errors] = [[], []]"
        ></v-text-field>
        <v-expand-transition>
          <template v-if="nonFieldErrors.length">
            <v-alert
              v-for="(err, index) in nonFieldErrors"
              :key="index"
              type="error"
              outlined
              dismissible
            >
              <span v-html="err"></span>
            </v-alert>
          </template>
        </v-expand-transition>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :disabled="submitDisabled" text type="submit">
          Sign up
          <v-icon right>arrow_forward</v-icon>
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import { authActions } from "@/auth";
import { generateUrl2 } from "@/utils/urls";
import axios from "axios";
import debounce from "lodash/debounce";

const noErrors = {
  non_field_errors: [],
  email: [],
  password1: [],
  password2: [],
};

export default {
  name: "SignUp",
  data() {
    return {
      email: "",
      password1: "",
      password2: "",
      errors: { ...noErrors },
      formValid: false,
      password1Touched: false,
      password2Touched: false,
      passwordRequirementTexts: [],
      userNonActionableErrors: [],
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
          !this.password1 ||
          !this.password2 ||
          this.errors.non_field_errors.length
      );
    },
  },
  watch: {
    password1() {
      if (this.password1) {
        this.password1Touched = true;
      }
      if (!this.password2Touched) {
        return;
      }
      this.errors.password2 = [];
      this.checkPassEquality();
    },
    password2() {
      if (this.password2) {
        this.password2Touched = true;
      }
      if (!this.password1Touched) {
        return;
      }
      this.errors.password2 = [];
      this.checkPassEquality();
    },
  },
  created() {
    axios.get(generateUrl2("password-reqs")).then(({ data }) => {
      this.$set(this, "passwordRequirementTexts", data);
    });
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        try {
          await this.$store.dispatch(authActions.SIGNUP, {
            email: this.email,
            password1: this.password1,
            password2: this.password2,
          });
          this.$router.push({ name: this.$routeNames.HOME }); // todo - welcome page
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
      this.errors.non_field_errors = [
        `Too many unsuccessful attempts in a short time. You can try again in: ${countdown}`,
      ];
      let interval = setInterval(() => {
        countdown -= 1;
        this.errors.non_field_errors = [
          `Too many unsuccessful attempts in a short time. You can try again in: ${countdown}`,
        ];
      }, 1000);
      setTimeout(() => {
        clearInterval(interval);
        this.errors.non_field_errors = [];
      }, retryAfter * 1000);
    },
    validEmailNaive(value) {
      if (!value) return true;
      // the backend does more thorough validation, we just want
      //   a basic level of it here for usability purposes
      if (/[^@]+@[^@.]+\.[^@]+/.test(value)) {
        return true;
      } else {
        return "Invalid email address.";
      }
    },
    validatePasswordNaive() {
      // the backend does more thorough validation, we just want
      //   a basic level of it here for usability purposes
      let rules = [
        v =>
          !v ||
          v.length >= 8 ||
          "This password is too short. It must contain at least 8 characters.",
        v => !/^\d+/.test(v) || "This password is entirely numeric.",
      ];
      rules.forEach(rule => {
        let result = rule(this.password1);
        if (result !== true) {
          this.errors.password1.push(result);
        }
      });
    },
    checkPassEquality: debounce(function() {
      if (
        this.password1 &&
        this.password2 &&
        this.password1 !== this.password2
      ) {
        this.errors.password2 = ["Passwords must match."];
      }
    }, 500),
  },
};
</script>
