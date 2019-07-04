<template>
  <v-card v-if="error" width="500" class="mx-auto mt-5">
    <v-toolbar flat dense dark color="secondary">
      <v-toolbar-title>Uh-oh, something went wrong.</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      Looks like Spotify authorization has failed.
    </v-card-text>
    <v-card-actions>
      <v-btn flat :to="{ name: $routeNames.HOME }" exact>
        <v-icon left>home</v-icon>
        return home
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn flat :href="spotifyAuthUrl">
        try again
        <v-icon right>arrow_forward</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
  <v-progress-linear v-else indeterminate></v-progress-linear>
</template>

<script>
import axios from "axios";
import { generateUrl2 } from "@/utils/urls";
import { mapGetters } from "vuex";

export default {
  name: "SpotifyAuth",
  data() {
    return {
      error: false,
    };
  },
  computed: {
    ...mapGetters(["spotifyAuthUrl"]),
  },
  async created() {
    let redirect_uri =
      window.location.protocol + "//" + window.location.host + this.$route.path;
    let { code, state, error } = this.$route.query;

    if (!code) {
      this.error = true;
      return;
    }

    try {
      let { data } = await axios.post(generateUrl2("spotify-auth"), {
        code,
        redirect_uri,
      });
      this.$store.commit("setSpotifyAuth", data);
      this.$router.push({ name: this.$routeNames.HOME });
    } catch (err) {
      this.error = true;
    }
  },
};
</script>
