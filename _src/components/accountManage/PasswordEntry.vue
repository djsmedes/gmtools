<template>
  <v-form ref="form" v-model="formValid" @submit.prevent="submit">
    <v-text-field
      v-model="email"
      :error-messages="errors.email"
      :error-count="errors.email.length || 1"
      :disabled="emailDisabled"
      autofocus
      label="Email"
      type="email"
      @input="[errors.email, errors.non_field_errors] = [[], []]"
    ></v-text-field>
    <v-text-field
      v-model="password1"
      :messages="errors.password1.length ? errors.password1 : undefined"
      :error="!!errors.password1.length"
      :error-count="errors.password1.length || 1"
      :type="showPass ? 'text' : 'password'"
      :append-icon="showPass ? 'visibility_off' : 'visibility'"
      :counter="password1.length < passMinLength ? passMinLength : undefined"
      label="Password"
      loading
      @click:append="showPass = !showPass"
      @input="[errors.password1, errors.non_field_errors] = [[], []]"
    >
      <template #progress>
        <v-progress-linear
          :value="passStrength"
          :color="passStrengthContent.color"
          absolute
        ></v-progress-linear>
      </template>
    </v-text-field>
    <v-layout align-baseline>
      <span class="grey--text">Password strength:</span>
      &nbsp;
      <span :class="passStrengthContent.textColor" class="font-weight-bold">
        {{ passStrengthContent.description }}
      </span>
      <v-spacer></v-spacer>
      <v-tooltip
        v-model="showPassHelp"
        :nudge-right="30"
        :max-width="300"
        right
        color="white"
        content-class="password-help"
      >
        <template #activator="{ on }">
          <v-btn
            text
            small
            color="grey"
            class="text-none body-2"
            tabindex="-1"
            @click="showPassHelp = !showPassHelp"
          >
            How do I create a strong password?
          </v-btn>
        </template>
        <v-toolbar flat dense dark color="grey darken-3">
          <v-toolbar-title>
            Strong Passwords
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="showPassHelp = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container class="black--text pa-2">
          <ul>
            <li class="mt-2">Are longer rather than shorter</li>
            <li class="mt-2">
              Contain a mix of character classes, i.e. upper- and lowercase
              letters, numbers, and special characters like #$%^
            </li>
            <li class="mt-2">
              Are not easy to guess, like 1234 or password1
            </li>
            <li class="mt-2">
              Are not similar to your other personal information like your email
              address
            </li>
            <li class="mt-2">
              Are unique (i.e. not reused for multiple services)
            </li>
          </ul>
          <p class="mt-3">
            It is difficult to remember dozens of unique, strong passwords, so
            cybersecurity experts recommend the use of a password manager like
            LastPass or 1Password.
          </p>
        </v-container>
      </v-tooltip>
    </v-layout>
    <v-text-field
      v-model="password2"
      :error-messages="errors.password2"
      :error-count="errors.password2.length"
      :type="showPass ? 'text' : 'password'"
      :append-icon="showPass ? 'visibility_off' : 'visibility'"
      label="Confirm password"
      @click:append="showPass = !showPass"
      @input="[errors.password2, errors.non_field_errors] = [[], []]"
    ></v-text-field>
    <v-expand-transition group>
      <v-alert
        v-for="(err, index) in nonFieldErrors"
        :key="index"
        :value="true"
        type="error"
        outline
      >
        <span v-html="err"></span>
      </v-alert>
    </v-expand-transition>
    <slot :submit-disabled="submitDisabled" name="submit-button">
      <v-btn
        :disabled="submitDisabled"
        block
        color="primary"
        large
        type="submit"
      >
        {{ submitButtonText }}
        <v-icon right>arrow_forward</v-icon>
      </v-btn>
    </slot>
  </v-form>
</template>

<script>
import debounce from "lodash/debounce";
import axios from "axios";
import { generateUrl2 } from "@/utils/urls";
import { countdown } from "@/utils/time";

const noErrors = {
  non_field_errors: [],
  email: [],
  password1: [],
  password2: [],
};

const passwordStrengths = {
  TOO_SHORT: {
    scoreCutoff: 0,
    color: "red darken-2",
    textColor: "red--text text--darken-2",
    description: "Too short",
  },
  WEAK: {
    scoreCutoff: 30, // this number is pretty much arbitrary, it just "looked right" to have it switch from weak to fair at about 1/3 of the bar
    color: "red darken-2",
    textColor: "red--text text--darken-2",
    description: "Weak",
  },
  FAIR: {
    scoreCutoff: 78, // a password of length 12 using all four character classes clocks in just above 78
    color: "amber darken-1",
    textColor: "amber--text text--darken-1",
    description: "Fair",
  },
  STRONG: {
    scoreCutoff: Infinity,
    color: "green darken-2",
    textColor: "green--text text--darken-2",
    description: "Strong",
  },
};

const charSetCounts = {
  LOWER: 26,
  UPPER: 26,
  DIGITS: 10,
  SYMBOLS: 33,
};

export default {
  name: "PasswordEntry",
  props: {
    submitButtonText: {
      type: String,
      default: "Sign up",
    },
    emailDisabled: {
      type: Boolean,
      default: false,
    },
    initialEmail: {
      type: String,
      default: "",
    },
    submitCallback: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      passMinLength: 8,
      formValid: true,
      errors: { ...noErrors },
      userNonActionableErrors: [],
      email: this.initialEmail,
      password1: "",
      password2: "",
      showPass: false,
      passStrength: -1,
      showPassHelp: false,
    };
  },
  computed: {
    submitDisabled() {
      return Boolean(
        !this.formValid ||
          !this.email ||
          this.validateEmailNaive() ||
          !this.password1 ||
          this.password1.length < this.passMinLength ||
          !this.password2 ||
          this.password1 !== this.password2 ||
          this.errors.non_field_errors.length
      );
    },
    passStrengthContent() {
      switch (true) {
        case this.passStrength < passwordStrengths.TOO_SHORT.scoreCutoff:
          return passwordStrengths.TOO_SHORT;
        case this.passStrength < passwordStrengths.WEAK.scoreCutoff:
          return passwordStrengths.WEAK;
        case this.passStrength < passwordStrengths.FAIR.scoreCutoff:
          return passwordStrengths.FAIR;
        default:
          return passwordStrengths.STRONG;
      }
    },
    nonFieldErrors() {
      return [...this.userNonActionableErrors, ...this.errors.non_field_errors];
    },
  },
  watch: {
    email() {
      this.checkEmailNaive();
    },
    password1: {
      async handler() {
        this.password1Touched = true;
        this.passStrength = await this.getPassStrength();
        if (!this.password2Touched) {
          return;
        }
        this.errors.password2 = [];
        this.checkPassEquality();
      },
      immediate: true,
    },
    password2() {
      if (this.password2) {
        this.password2Touched = true;
      }
      if (!this.password1Touched) {
        return;
      }
      this.checkPassEquality();
    },
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        try {
          await this.submitCallback(this);
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
      countdown(
        retryAfter,
        countdown =>
          (this.userNonActionableErrors = [
            `Too many unsuccessful attempts in a short time. You can try again in: ${countdown}`,
          ]),
        () => (this.userNonActionableErrors = [])
      );
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
    checkEmailNaive: debounce(function() {
      let err = this.validateEmailNaive();
      if (err) {
        this.errors.email = [err];
      }
    }, 500),
    passwordBackendValidate: debounce(async function(callback) {
      let { data } = await axios.post(generateUrl2("password-validate"), {
        email: this.email,
        password: this.password1,
      });
      if (data) {
        // data will be an array of messages about what is wrong with the password
        //   for now, we are ignoring it, but it could be useful
        let [,] = data;
        callback(false);
      } else {
        callback(true);
      }
    }, 500),
    async getPassStrength() {
      if (!this.password1 || this.password1.length < this.passMinLength) {
        return -1;
      }

      if (
        !(await new Promise(resolve => this.passwordBackendValidate(resolve)))
      ) {
        return 2; // large enough to visually differentiate from "too short" but small enough to be obviously extremely weak
      }

      let charSetCardinality = 0;
      if (/[a-z]/.test(this.password1)) {
        charSetCardinality += charSetCounts.LOWER;
      }
      if (/[A-Z]/.test(this.password1)) {
        charSetCardinality += charSetCounts.UPPER;
      }
      if (/[0-9]/.test(this.password1)) {
        charSetCardinality += charSetCounts.DIGITS;
      }
      if (/[^a-zA-Z0-9]/.test(this.password1)) {
        charSetCardinality += charSetCounts.SYMBOLS;
      }

      // H = L * log_2 N
      //   H := password strength
      //   L := password length
      //   N := number of possible symbols
      // https://en.wikipedia.org/wiki/Password_strength#Random_passwords
      let strength = this.password1.length * Math.log2(charSetCardinality);
      return Math.min(Math.floor(strength), 100);
    },
    validateEmailNaive() {
      if (!this.email) return false;
      // the backend does more thorough validation, we just want
      //   a basic level of it here for usability purposes
      if (/[^@]+@[^@.]+\.[^@]+/.test(this.email)) {
        return false;
      } else {
        return "Invalid email address.";
      }
    },
  },
};
</script>

<style scoped lang="scss">
.password-help {
  padding: 0;

  &:not(.slide-x-transition-leave-active):not(.slide-x-transition-enter-active),
  &.slide-x-transition-enter-to {
    opacity: 1 !important;
  }
}
</style>
