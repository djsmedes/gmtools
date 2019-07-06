<template>
  <v-container>
    <v-layout column align-center>
      <v-card :width="300" class="elevation-5">
        <v-img
          contain
          aspect-ratio="1"
          :src="playingInfo.img_url"
          :max-width="300"
          :max-height="300"
        ></v-img>
      </v-card>
      <v-flex mt-3 class="title">
        {{ playingInfo.track_name }}
      </v-flex>
      <v-flex>
        {{ playingInfo.track_artist_name }}
      </v-flex>
      <v-layout mt-1 align-center>
        <v-btn
          icon
          @click="toggleShuffleState"
          :disabled="disallows.toggling_shuffle"
        >
          <v-icon :color="playingInfo.shuffle_state ? 'green' : undefined">
            shuffle
          </v-icon>
        </v-btn>
        <v-btn
          icon
          @click="skipTrack('previous')"
          :disabled="disallows.skipping_prev"
        >
          <v-icon>
            skip_previous
          </v-icon>
        </v-btn>
        <v-btn icon large @click="togglePlayState">
          <v-icon large>
            {{ playingInfo.is_playing ? "pause" : "play_arrow" }}
          </v-icon>
        </v-btn>
        <v-btn
          icon
          @click="skipTrack('next')"
          :disabled="disallows.skipping_next"
        >
          <v-icon>
            skip_next
          </v-icon>
        </v-btn>
        <v-btn
          icon
          @click="cycleRepeatState"
          :disabled="
            disallows.toggling_repeat_track || disallows.toggling_repeat_context
          "
        >
          <v-icon
            :color="
              !playingInfo.repeat_state || playingInfo.repeat_state === 'off'
                ? undefined
                : 'green'
            "
          >
            {{ playingInfo.repeat_state === "track" ? "repeat_one" : "repeat" }}
          </v-icon>
        </v-btn>
      </v-layout>
    </v-layout>

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
      <v-btn icon @click="getPlayingInfo">
        <v-icon>info</v-icon>
      </v-btn>
    </template>
    <a :href="spotifyAuthUrl">Authenticate</a>
  </v-container>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import axios from "axios";
import SpotifyPlaylistSelectionDialog from "@/components/gmscreen/SpotifyPlaylistSelectionDialog";
import { epochNow, sleep } from "@/utils/time";
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
      isDelay: false,
    };
  },
  computed: {
    ...mapGetters(["spotifyAuth", "spotifyAuthUrl"]),
    isSpotifyAuthorized() {
      return Boolean(this.spotifyAuth && this.spotifyAuth.access_token);
    },
    disallows() {
      if (
        this.playingInfo &&
        this.playingInfo.actions &&
        this.playingInfo.actions.disallows
      ) {
        return this.playingInfo.actions.disallows;
      } else {
        return {};
      }
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
      if (this.isDelay) {
        return;
      }
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
    async delay() {
      this.isDelay = true;
      await sleep(200);
      this.isDelay = false;
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
      let {
        duration_ms,
        name: track_name,
        artists: track_artists,
        album,
      } = track;
      let [{ name: track_artist_name }] = track_artists;
      let img_url = this.getImgSrc(album);
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
        img_url,
      };
      if (this.getNextTrackInfoCbId) {
        clearTimeout(this.getNextTrackInfoCbId);
      }
      if (is_playing) {
        this.getNextTrackInfoCbId = setTimeout(
          this.getPlayingInfo,
          duration_ms - progress_ms + 750
        );
      }
    },
    async play(playlistId) {
      let data = playlistId
        ? { context_uri: `spotify:playlist:${playlistId}` }
        : {};
      await this.request({
        method: "put",
        url: `/me/player/play?device_id=${this.selectedDeviceId}`,
        data,
      });
    },
    async pause() {
      await this.request({
        method: "put",
        url: `/me/player/pause?device_id=${this.selectedDeviceId}`,
      });
    },
    async togglePlayState() {
      if (this.playingInfo.is_playing) {
        await this.pause();
      } else {
        await this.play();
      }
      await this.delay();
      return this.getPlayingInfo();
    },
    async toggleShuffleState() {
      let newState = !this.playingInfo.shuffle_state;
      await this.request({
        method: "put",
        url: `/me/player/shuffle?state=${newState}`,
      });
      await this.delay();
      return this.getPlayingInfo();
    },
    async cycleRepeatState() {
      let newState;
      switch (this.playingInfo.repeat_state) {
        case "track":
          newState = "off";
          break;
        case "context":
          newState = "track";
          break;
        default:
          newState = "context";
          break;
      }
      await this.request({
        method: "put",
        url: `/me/player/repeat?state=${newState}`,
      });
      await this.delay();
      return this.getPlayingInfo();
    },
    async skipTrack(direction) {
      await this.request({
        method: "post",
        url: `/me/player/${direction}`,
      });
      await this.delay();
      return this.getPlayingInfo();
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
    getImgSrc({ images }) {
      let [tooBig, good, tooSmall] = images;
      let chosenImage = good || tooBig || tooSmall || { url: "" };
      return chosenImage.url;
    },
  },
};
</script>

<style scoped lang="scss">
.v-responsive.v-image {
  background: linear-gradient(to bottom right, #575757, #adadad);
}
</style>
