<template>
  <v-container>
    <pre>
      {{ JSON.stringify(playingInfo, null, 2) }}
    </pre>

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
  </v-container>
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
      playingInfo: {},
      devices: [],
      playlists: [],
      selectedPlaylists: [],
      selectedDeviceId: null,
      isPlaying: false,
      getNextTrackInfoCbId: null,
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
      return await axios({
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
        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line
          console.log("Spotify access token expired, caught before triggering a 401.")
        }
      } else {
        try {
          return await this.spotifyAxios(config);
        } catch (err) {
          if (err.response && err.response.status === 401) {
            if (process.env.NODE_ENV !== "production") {
              // eslint-disable-next-line
              console.log("Spotify access token expired, 401 triggered.")
            }
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
    async getPlaylist(id) {
      let { data } = await this.request({
        method: "get",
        url: `/playlists/${id}`,
      });
      this.playlists = data.items;
    },
    async getPlayingInfo() {
      let response = await this.request({
        method: "get",
        url: "/me/player",
      });
      let data = response.status === 204 ? {} : response.data;
      let {
        device,
        shuffle_state,
        repeat_state,
        progress_ms,
        item: track,
        is_playing,
        actions,
      } = data;
      let { duration_ms, name: track_name, artists: track_artists } = track;
      let [{ name: track_artist_name }] = track_artists;
      this.selectedDeviceId = device.id;
      this.playingInfo = {
        shuffle_state,
        repeat_state,
        progress_ms,
        duration_ms,
        track_name,
        track_artist_name,
        is_playing,
        actions,
      };
      if (this.getNextTrackInfoCbId) {
        clearTimeout(this.getNextTrackInfoCbId);
      }
      if (is_playing) {
        this.getNextTrackInfoCbId = setTimeout(
          this.getPlayingInfo,
          duration_ms - progress_ms + 500
        );
      }
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
