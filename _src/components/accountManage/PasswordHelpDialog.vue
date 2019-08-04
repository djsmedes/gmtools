<template>
  <functional-dialog-wrapper
    v-bind="dialogAttrs"
    title="Strong Passwords"
    v-on="dialogListeners"
  >
    <v-card-text>
      <ul>
        <li class="mt-2">Are longer rather than shorter</li>
        <li class="mt-2">
          Contain a mix of character classes, i.e. upper- and lowercase letters,
          numbers, and special characters like #$%^
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
    </v-card-text>
  </functional-dialog-wrapper>
</template>

<script>
import { functionalDialogMixin } from "@/mixins";
import FunctionalDialogWrapper from "@/components/generic/FunctionalDialogWrapper";

export default {
  name: "PasswordHelpDialog",
  components: { FunctionalDialogWrapper },
  mixins: [functionalDialogMixin],
};
</script>
