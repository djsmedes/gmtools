<template>
  <v-card :width="500" class="mx-auto">
    <v-card-text>
      <password-entry :submit-callback="submit">
        <template #submit-button="{ submitDisabled }">
          <v-card-actions class="mb-n3 mr-n3">
            <v-spacer></v-spacer>
            <v-btn :disabled="submitDisabled" text type="submit" color="go">
              Sign in
              <v-icon right>arrow_forward</v-icon>
            </v-btn>
          </v-card-actions>
        </template>
      </password-entry>
    </v-card-text>
  </v-card>
</template>

<script>
import { authActions } from "@/auth";
import PasswordEntry from "@/components/accountManage/PasswordEntry";

export default {
  name: "SignUp",
  components: { PasswordEntry },
  methods: {
    async submit({ email, password1, password2 }) {
      await this.$store.dispatch(authActions.SIGNUP, {
        email,
        password1,
        password2,
      });
      this.$router.push({ name: this.$routeNames.HOME }); // todo - welcome page
    },
  },
};
</script>
