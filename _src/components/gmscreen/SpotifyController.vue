<template>
  <div>
    <template v-if="isSpotifyAuthorized">
      <v-select
        v-model="selectedDeviceId"
        :items="devices"
        item-value="id"
        item-text="name"
        @focus="getDevices"
      ></v-select>
      <v-btn icon @click="play">
        <v-icon>play_arrow</v-icon>
      </v-btn>
      <v-btn icon @click="getPlayingInfo">
        <v-icon>info</v-icon>
      </v-btn>
      <v-btn icon @click="pause">
        <v-icon>pause</v-icon>
      </v-btn>
    </template>
    <a v-else :href="authUrl">Authenticate</a>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import baseAxios from "axios";

export default {
  name: "SpotifyController",
  props: {
    foo: {
      type: String,
      default: "foo",
    },
  },
  data() {
    return {
      client_id: "4c7dbd05cc7548beb32c02c5ba65994e",
      last_response: {},
      devices: [],
      selectedDeviceId: null,
      isPlaying: false,
    };
  },
  computed: {
    ...mapGetters({
      spotifyAuth: "spotifyAuth",
    }),
    axios() {
      return baseAxios.create({
        baseURL: "https://api.spotify.com/v1/me",
        headers: {
          Authorization: `${this.spotifyAuth.token_type} ${
            this.spotifyAuth.access_token
          }`,
        },
      });
    },
    isSpotifyAuthorized() {
      return Boolean(this.spotifyAuth.access_token);
    },
    authUrl() {
      let base = "https://accounts.spotify.com/authorize";
      let query_params = {
        client_id: this.client_id,
        response_type: "token",
        redirect_uri: "http://localhost:8080/spotify-response/",
        state: "this is state",
        scope: [
          "user-read-playback-state",
          "user-read-currently-playing",
          "user-modify-playback-state",
          "playlist-read-collaborative",
          "playlist-read-private",
        ].join(" "),
        show_dialog: true,
      };
      let toBeEncoded = Object.entries(query_params).reduce(
        (accumulator, [key, val], index) => {
          return accumulator + (index ? "&" : "?") + key + "=" + val;
        },
        base
      );
      return encodeURI(toBeEncoded);
    },
  },
  created() {
    if (this.isSpotifyAuthorized) {
      this.getDevices();
    }
  },
  methods: {
    async getDevices() {
      let { data } = await this.axios.get("/player/devices");
      this.devices = data.devices;
    },
    async play() {
      let response = await this.axios.put(
        `/player/play?device_id=${this.selectedDeviceId}`
      );
    },
    async getPlayingInfo() {
      let response = await this.axios.get("/player");
      this.selectedDeviceId = response.data.device.id;
    },
    async pause() {
      let response = await this.axios.put(
        `/player/pause?device_id=${this.selectedDeviceId}`
      );
    },
  },
};
</script>
