<template>
  <v-dialog
    v-model="dialog"
    :max-width="width"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    persistent
    @keydown.esc="cancel"
  >
    <v-toolbar dark color="grey darken-2" dense>
      <v-toolbar-title>Invite Players</v-toolbar-title>
    </v-toolbar>
    <v-card tile>
      <v-card-text>
        some stuff here
      </v-card-text>
      <v-card-actions>
        <v-btn flat>
          cancel
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn flat>
          <v-icon left></v-icon>
          send invites
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "InvitePlayers",
  data() {
    return {
      dialog: false,
    };
  },
  computed: {
    width() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "220px";
        case "sm":
          return "400px";
        case "md":
          return "500px";
        case "lg":
          return "600px";
        case "xl":
          return "800px";
      }
    },
  },
  methods: {
    cancel() {
      this.dialog = false;
      this.$emit("close", null);
    },
    open() {
      this.dialog = true;
    },
  },
};
</script>
