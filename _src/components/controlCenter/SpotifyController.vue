<template>
  <div>
    <v-progress-linear
      v-show="isDelay"
      indeterminate
      color="green"
      style="position: absolute"
      class="my-0"
    ></v-progress-linear>
    <v-container>
      <v-layout v-if="isSpotifyAuthorized">
        <v-flex grow style="flex-basis: 0">
          <v-list class="py-0">
            <v-subheader class="pt-0 pr-0" d-flex>
              Playlists
              <v-spacer></v-spacer>
              <v-btn icon text color="edit" @click="choosePlaylists">
                <v-icon>edit</v-icon>
              </v-btn>
            </v-subheader>
            <div :style="`overflow: auto; max-height: ${height - 48}px`">
              <v-hover v-for="playlist in playlists" :key="playlist.id">
                <template #default="{ hover }">
                  <v-list-item @click="play(playlist.id)">
                    <v-list-item-content>
                      <v-list-item-title
                        :class="{
                          'font-weight-bold':
                            selectedPlaylistId === playlist.id,
                          'green--text': selectedPlaylistId === playlist.id,
                        }"
                        class="text-truncate"
                      >
                        {{ playlist.name }}
                      </v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-icon :color="hover ? 'green' : 'grey lighten-3'">
                        play_arrow
                      </v-icon>
                    </v-list-item-action>
                  </v-list-item>
                </template>
              </v-hover>
            </div>
          </v-list>
        </v-flex>
        <v-flex
          :style="`height: ${height}px`"
          shrink
          style="max-width: 300px"
          mx-4
        >
          <v-layout column align-center fill-height>
            <v-flex shrink>
              <v-card :width="300" class="elevation-5">
                <v-img
                  :src="playingInfo.img_url"
                  :max-width="300"
                  :max-height="300"
                  contain
                  aspect-ratio="1"
                  class="album-art"
                ></v-img>
              </v-card>
            </v-flex>
            <v-tooltip bottom>
              <template #activator="{ on }">
                <v-flex
                  ref="trackTitle"
                  shrink
                  mt-4
                  class="title text-truncate text-center"
                  style="width: 300px"
                  v-on="on"
                >
                  {{ playingInfo.track_name || "&mdash;" }}
                </v-flex>
              </template>
              {{ playingInfo.track_name || "&mdash;" }}
              <template v-if="playingInfo.track_url">
                <br />
                click here to open in spotify
              </template>
            </v-tooltip>
            <v-flex shrink>
              {{ playingInfo.track_artist_name || "&mdash;" }}
            </v-flex>
            <v-flex shrink>
              <v-layout mt-1 align-center>
                <v-btn
                  :disabled="disallows.toggling_shuffle"
                  icon
                  @click="toggleShuffleState"
                >
                  <v-icon
                    :color="playingInfo.shuffle_state ? 'green' : undefined"
                  >
                    shuffle
                  </v-icon>
                </v-btn>
                <v-btn
                  :disabled="disallows.skipping_prev"
                  icon
                  @click="skipTrack('previous')"
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
                  :disabled="disallows.skipping_next"
                  icon
                  @click="skipTrack('next')"
                >
                  <v-icon>
                    skip_next
                  </v-icon>
                </v-btn>
                <v-btn
                  :disabled="
                    disallows.toggling_repeat_track ||
                      disallows.toggling_repeat_context
                  "
                  icon
                  @click="cycleRepeatState"
                >
                  <v-icon
                    :color="
                      !playingInfo.repeat_state ||
                      playingInfo.repeat_state === 'off'
                        ? undefined
                        : 'green'
                    "
                  >
                    {{
                      playingInfo.repeat_state === "track"
                        ? "repeat_one"
                        : "repeat"
                    }}
                  </v-icon>
                </v-btn>
              </v-layout>
            </v-flex>
            <v-flex shrink d-flex class="my-4">
              <v-img :src="spotifyLogo" width="166" contain></v-img>
            </v-flex>
            <v-flex>
              <v-btn
                text
                class="grey--text text--lighten-1 text-none"
                @click="confirmDisconnect"
              >
                Disconnect Spotify account
              </v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex grow style="flex-basis: 0">
          <v-list class="py-0">
            <v-subheader class="pt-0 pr-0" d-flex>
              Playback Devices
              <v-spacer></v-spacer>
              <v-btn icon text color="edit" @click="getDevices">
                <v-icon>autorenew</v-icon>
              </v-btn>
            </v-subheader>
            <div :style="`overflow: auto; max-height: ${height - 48}px`">
              <v-hover v-for="device in devices" :key="device.id">
                <template #default="{ hover }">
                  <v-list-item @click="setPlaybackDevice(device.id)">
                    <v-list-item-content>
                      <v-list-item-title
                        :class="{
                          'font-weight-bold': selectedDeviceId === device.id,
                          'green--text': selectedDeviceId === device.id,
                        }"
                        class="text-truncate"
                      >
                        {{ device.name }}
                      </v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-icon :color="hover ? 'green' : 'grey lighten-3'">
                        play_arrow
                      </v-icon>
                    </v-list-item-action>
                  </v-list-item>
                </template>
              </v-hover>
            </div>
          </v-list>
        </v-flex>
      </v-layout>

      <v-layout v-else>
        <v-spacer></v-spacer>
        <v-flex style="max-width: 300px">
          <v-img :src="spotifyLogo" contain></v-img>
          <div class="mt-4">
            GMTOOLS uses the Spotify Web API to let you control your Spotify
            playback right from here.
          </div>
          <v-btn :href="spotifyAuthUrl" text class="text-none green--text">
            Connect your Spotify account now
          </v-btn>
        </v-flex>
        <v-spacer></v-spacer>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import axios from "axios";
import SpotifyPlaylistSelectionDialog from "@/components/controlCenter/SpotifyPlaylistSelectionDialog";
import { epochNow, sleep } from "@/utils/time";
import { generateUrl2 } from "@/utils/urls";
import { ButtonOption } from "@/plugins/userChoiceDialog";
import find from "lodash/find";
import findIndex from "lodash/findIndex";

export default {
  name: "SpotifyController",
  data() {
    return {
      playingInfo: {},
      devices: [],
      playlists: [],
      selectedPlaylistId: null,
      selectedDeviceId: null,
      isPlaying: false,
      getNextTrackInfoCbId: null,
      isDelay: false,
      height: 550,
      scroll: false,
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
    spotifyLogo() {
      return require("@/assets/img/spotify/Spotify_Logo_RGB_Green.png");
    },
  },
  created() {
    if (this.isSpotifyAuthorized) {
      this.getDevices();
      this.getPlayingInfo();
      let playlistsJSON = localStorage.getItem("gmtools_spotify_playlists");
      this.playlists = playlistsJSON ? JSON.parse(playlistsJSON) : [];
    }
  },
  methods: {
    ...mapMutations(["setSpotifyAuth", "clearSpotifyAuth"]),
    async spotifyAxios(config) {
      return await axios({
        ...config,
        baseURL: "https://api.spotify.com/v1",
        headers: {
          Authorization: `${this.spotifyAuth.token_type} ${this.spotifyAuth.access_token}`,
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
          } else if (
            err.response &&
            err.response.status === 404 &&
            err.response.data.error.reason === "NO_ACTIVE_DEVICE"
          ) {
            this.recoverFromNoDevice();
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
    async delay(ms = 1000) {
      this.isDelay = true;
      await sleep(ms);
      this.isDelay = false;
    },
    async getDevices() {
      let { data } = await this.request({
        method: "get",
        url: "/me/player/devices",
      });
      this.devices = data.devices;
      this.selectedDeviceId = null;
      for (let device of this.devices) {
        if (device.is_active) {
          this.selectedDeviceId = device.id;
          break;
        }
      }
    },
    async recoverFromNoDevice() {
      let msg;
      let device = find(this.devices, { id: this.selectedDeviceId });
      if (!device) {
        this.selectedDeviceId = null;
        msg = "Select a device first";
      } else {
        await this.getDevices();
        if (!this.selectedDeviceId) {
          msg = `${device.name} could not be found. Reopen the Spotify app, then refresh the device list.`;
        } else {
          this.setPlaybackDevice(device.id);
        }
      }
      if (msg) {
        this.$showSnack(msg);
      }
    },
    async setPlaybackDevice(deviceId) {
      try {
        await this.request({
          method: "put",
          url: "/me/player",
          data: { device_ids: [deviceId] },
        });
        await this.delay();
        return this.getPlayingInfo();
      } catch (err) {
        if (err.response && err.response.status === 404) {
          let attemptedDeviceIndex = findIndex(this.devices, { id: deviceId });
          if (attemptedDeviceIndex !== -1) {
            let [attemptedDevice] = this.devices.splice(
              attemptedDeviceIndex,
              1
            );
            this.$showSnack(
              `${attemptedDevice.name} could not be found. Reopen the Spotify app, then refresh the device list.`
            );
          }
        } else {
          throw err;
        }
      }
    },
    async getPlayingInfo() {
      if (this.getNextTrackInfoCbId) {
        clearTimeout(this.getNextTrackInfoCbId);
      }
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
        context,
      } = data;

      let track_info = {};
      if (track) {
        let {
          duration_ms,
          name: track_name,
          artists: track_artists,
          album,
        } = track;
        let [{ name: track_artist_name }] = track_artists;
        let img_url = this.getImgSrc(album);

        track_info = {
          duration_ms,
          track_name,
          track_artist_name,
          img_url,
        };

        if (
          is_playing &&
          duration_ms !== undefined &&
          progress_ms !== undefined
        ) {
          this.getNextTrackInfoCbId = setTimeout(
            this.getPlayingInfo,
            duration_ms - progress_ms + 1000
          );
        }
      }

      if (context) {
        let { type: context_type, uri: context_uri } = context;
        if (context_type === "playlist") {
          let [playlist_id] = context_uri.match(/[^:]+$/);
          this.selectedPlaylistId = playlist_id;
        } else {
          this.selectedPlaylistId = null;
        }
      }

      this.selectedDeviceId = (device && device.id) || null;
      this.playingInfo = {
        shuffle_state,
        repeat_state,
        progress_ms,
        is_playing,
        actions,
        ...track_info,
      };
    },
    async play(playlistId) {
      let data = playlistId
        ? { context_uri: `spotify:playlist:${playlistId}` }
        : {};
      await this.request({
        method: "put",
        url: `/me/player/play`,
        // url: `/me/player/play?device_id=${this.selectedDeviceId}`,
        data,
      });
      await this.delay();
      return this.getPlayingInfo();
    },
    async pause() {
      await this.request({
        method: "put",
        url: `/me/player/pause`,
      });
      await this.delay();
      return this.getPlayingInfo();
    },
    async togglePlayState() {
      if (this.playingInfo.is_playing) {
        return await this.pause();
      } else {
        return await this.play();
      }
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
      await this.delay(300);
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
        preSelected: this.playlists,
      });
      if (reply) {
        this.playlists = reply;
        localStorage.setItem(
          "gmtools_spotify_playlists",
          JSON.stringify(reply)
        );
      }
    },
    getImgSrc({ images }) {
      let [tooBig, good, tooSmall] = images;
      let chosenImage = good || tooBig || tooSmall || { url: "" };
      return chosenImage.url;
    },
    async confirmDisconnect() {
      let reply = await this.$userChoice(
        "Disconnect Spotify account?",
        "If you disconnect your Spotify account, all data relating to Spotify will be purged from GMTOOLS.",
        [
          new ButtonOption({
            returnVal: true,
            text: "Disconnect account",
            attrs: { color: "delete" },
          }),
          new ButtonOption(),
        ]
      );
      if (reply) {
        localStorage.removeItem("gmtools_spotify_playlists");
        this.clearSpotifyAuth();
      }
    },
  },
};
</script>

<style scoped lang="scss">
.album-art.v-responsive.v-image {
  background: linear-gradient(to bottom right, #575757, #adadad);
}
</style>
