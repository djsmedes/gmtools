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
      <v-btn @click="choosePlaylists">
        Choose playlists
      </v-btn>
      <v-select
        v-model="selectedDeviceId"
        :items="playlists"
        item-value="id"
        item-text="name"
        @focus="getPlaylists"
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
    <a :href="spotifyAuthUrl">Authenticate</a>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import axios from "axios";
import SpotifyPlaylistSelectionDialog from "@/components/gmscreen/SpotifyPlaylistSelectionDialog";
import { epochNow } from "@/utils/time";
import { generateUrl2 } from "@/utils/urls";

export default {
  name: "SpotifyController",
  data() {
    return {
      last_response: {},
      devices: [],
      playlists: [],
      selectedPlaylists: [],
      selectedDeviceId: null,
      isPlaying: false,
    };
  },
  computed: {
    ...mapGetters(["spotifyAuth", "spotifyAuthUrl"]),
    isSpotifyAuthorized() {
      return Boolean(this.spotifyAuth && this.spotifyAuth.access_token);
    },
  },
  created() {
    if (this.isSpotifyAuthorized) {
      this.getDevices();
    }
  },
  methods: {
    ...mapMutations(["setSpotifyAuth"]),
    async spotifyAxios(config) {
      return axios({
        ...config,
        baseURL: "https://api.spotify.com/v1",
        headers: {
          Authorization: `${this.spotifyAuth.token_type} ${
            this.spotifyAuth.access_token
          }`,
        },
      });
    },
    async request(config) {
      if (epochNow() > parseInt(this.spotifyAuth.expires_at)) {
        // do refresh
      } else {
        try {
          return await this.spotifyAxios(config);
        } catch (err) {
          if (
            err.response &&
            err.response.status === 401 &&
            err.response.message === "The access token expired"
          ) {
            // do refresh
          } else {
            throw err;
          }
        }
      }

      let { data } = await axios.post(generateUrl2("spotify-auth"), {
        refresh_token: this.spotifyAuth.refresh_token,
      });
      this.setSpotifyAuth(data);

      return await this.spotifyAxios(config);
    },
    async getDevices() {
      let { data } = await this.request({
        method: "get",
        url: "/me/player/devices",
      });
      this.devices = data.devices;
      for (let device of this.devices) {
        if (device.is_active) {
          this.selectedDeviceId = device.id;
          break;
        }
      }
    },
    async getPlaylists() {
      let { data } = await this.request({
        method: "get",
        url: "/me/playlists?limit=50",
      });
      this.playlists = data.items;
    },
    async getPlayingInfo() {
      let { data } = await this.request({
        method: "get",
        url: "/player",
      });
      this.selectedDeviceId = data.device.id;
    },
    async play() {
      await this.request({
        method: "put",
        url: `/me/player/play?device_id=${this.selectedDeviceId}`,
        data: {
          context_uri: "spotify:user:djsmedes:playlist:5KJsn1QRw6JHAlVSg3LJ0j",
        },
      });
    },
    async pause() {
      await this.request({
        method: "put",
        url: `/me/player/pause?device_id=${this.selectedDeviceId}`,
      });
    },
    async choosePlaylists() {
      let reply = await this.$dialog(SpotifyPlaylistSelectionDialog, {
        request: this.request,
        preSelected: this.selectedPlaylists,
      });
      if (reply) {
        this.selectedPlaylists = reply;
      }
    },
  },
};
</script>
