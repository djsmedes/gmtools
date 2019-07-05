<template>
  <v-dialog v-model="dialog" v-bind="sizeAttrs" @keydown.esc="close(null)">
    <v-card>
      <v-toolbar flat dark dense class="grey darken-3">
        <v-toolbar-title>Choose playlists</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="close(null)">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container pl-0>
        <v-layout>
          <v-flex
            xs6
            sm6
            md8
            lg9
            xl10
            style="overflow: auto; max-height: calc(100vh - 300px)"
          >
            <v-container grid-list-md py-0>
              <v-item-group v-model="selectedIndices" multiple>
                <v-data-iterator
                  :items="playlists"
                  :rows-per-page-items="[-1]"
                  hide-actions
                  content-tag="v-layout"
                  wrap
                >
                  <template #item="{ item }">
                    <v-flex xs12 sm6 md4 lg3 xl2>
                      <v-hover>
                        <template #default="{ hover }">
                          <v-item>
                            <template #default="{ active, toggle }">
                              <v-card
                                :class="{
                                  'elevation-0': !hover,
                                  'elevation-5': hover,
                                }"
                                :color="
                                  active ? 'primary lighten-2' : undefined
                                "
                                @click="toggle"
                              >
                                <div class="pt-2 mx-2">
                                  <v-img
                                    :src="getImgSrc(item)"
                                    aspect-ratio="1"
                                  ></v-img>
                                </div>
                                <v-card-title class="font-weight-medium">
                                  {{ item.name }}
                                </v-card-title>
                              </v-card>
                            </template>
                          </v-item>
                        </template>
                      </v-hover>
                    </v-flex>
                  </template>
                  <template #footer v-if="!areAllLoaded">
                    <v-fade-transition mode="out-in">
                      <v-progress-linear
                        indefinite
                        v-if="loadingFromSpotify"
                      ></v-progress-linear>
                      <v-btn v-else flat block @click="loadMore">
                        Load more...
                      </v-btn>
                    </v-fade-transition>
                  </template>
                </v-data-iterator>
              </v-item-group>
            </v-container>
          </v-flex>
          <v-flex
            xs6
            sm6
            md4
            lg3
            xl2
            class="pl-3"
            style="overflow: auto; max-height: calc(100vh - 300px)"
          >
            <h4 class="title">
              Selected
            </h4>
            <v-list>
              <v-hover v-for="(item, index) in selectedSorted" :key="index">
                <template #default="{ hover }">
                  <v-list-tile
                    :class="{ 'pt-1': index }"
                    class="px-0"
                    :style="{
                      background: hover ? 'rgba(0, 0, 0, 0.04)' : undefined,
                    }"
                  >
                    <v-list-tile-avatar>
                      <v-avatar tile size="48">
                        <v-img :src="getImgSrc(item)"></v-img>
                      </v-avatar>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title class="text-truncate">
                        {{ item.name }}
                      </v-list-tile-title>
                    </v-list-tile-content>
                    <v-btn
                      icon
                      flat
                      v-if="hover"
                      @click="removeFromSelectedById(item.id)"
                    >
                      <v-icon>clear</v-icon>
                    </v-btn>
                  </v-list-tile>
                </template>
              </v-hover>
            </v-list>
            <span v-if="!selected.length" class="grey--text">
              Select playlists to save them as options from the player.
            </span>
          </v-flex>
        </v-layout>
      </v-container>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          :disabled="!isSelectionChanged"
          @click="close(selectedSorted)"
          color="save"
          flat
        >
          <v-icon left>save</v-icon>
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { functionalDialogMixin } from "@/mixins";
import xorBy from "lodash/xorBy";
import difference from "lodash/difference";
import findIndex from "lodash/findIndex";

export default {
  name: "SpotifyPlaylistSelectionDialog",
  mixins: [functionalDialogMixin],
  props: {
    request: {
      type: Function,
      required: true,
    },
    preSelected: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      playlists: [],
      totalPlaylistCount: null, // starts as null instead of 0 so we know if we've tried
      selectedIndices: [],
      selected: [...this.preSelected],
      loadingFromSpotify: false,
    };
  },
  watch: {
    selectedIndices: {
      handler(newVal, oldVal) {
        let newIndices = difference(newVal, oldVal);
        let removingIndices = difference(oldVal, newVal);
        for (let index of newIndices) {
          let newPlaylist = this.playlists[index];
          if (!this.selectedIds.includes(newPlaylist)) {
            this.selected.push(newPlaylist);
          }
        }
        for (let index of removingIndices) {
          let removingPlaylistId = this.playlists[index].id;
          let removingPlaylistSelectedIndex = findIndex(this.selected, {
            id: removingPlaylistId,
          });
          this.selected.splice(removingPlaylistSelectedIndex, 1);
        }
      },
    },
  },
  computed: {
    sizeAttrs() {
      let attrs = {};
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          attrs.fullscreen = true;
          break;
        case "sm":
          attrs["max-width"] = "calc(100vw - 40px)";
          break;
        case "md":
          attrs["max-width"] = "900px";
          break;
        case "lg":
          attrs["max-width"] = "1185px";
          break;
        case "xl":
          attrs["max-width"] = "1785px";
          break;
      }
      return attrs;
    },
    selectedIds() {
      return this.selected.map(item => item.id);
    },
    areAllLoaded() {
      return this.playlists.length === this.totalPlaylistCount;
    },
    isSelectionChanged() {
      return Boolean(xorBy(this.preSelected, this.selected, "id").length);
    },
    selectedSorted() {
      let selected = [...this.selected];
      let output = [];
      for (let playlist of this.playlists) {
        let selectedIndex = findIndex(selected, { id: playlist.id });
        if (selectedIndex !== -1) {
          let [selectedPlaylist] = selected.splice(selectedIndex, 1);
          if (selectedPlaylist) {
            output.push(selectedPlaylist);
          }
        }
      }
      return [...output, ...selected];
    },
  },
  created() {
    this.loadMore();
  },
  methods: {
    async loadMore() {
      this.loadingFromSpotify = true;
      let { data } = await this.request({
        method: "get",
        url: `/me/playlists?limit=12&offset=${this.playlists.length}`,
      });
      for (let playlist of data.items) {
        this.playlists.push(playlist);
        if (this.selectedIds.includes(playlist.id)) {
          this.selectedIndices.push(this.playlists.length - 1);
        }
      }
      this.totalPlaylistCount = data.total;
      this.loadingFromSpotify = false;
    },
    getImgSrc(playlist) {
      let [tooBig, good, tooSmall] = playlist.images;
      let chosenImage = good || tooBig || tooSmall || { url: "" };
      return chosenImage.url;
    },
    removeFromSelectedById(playlistId) {
      let playlistIndex = findIndex(this.playlists, { id: playlistId });
      if (playlistIndex !== -1) {
        let selectionIndex = this.selectedIndices.indexOf(playlistIndex);
        if (selectionIndex !== -1) {
          // the fact that this doesn't trigger the watch is good here - we have to manually
          //   remove not-yet-loaded ones anyway, so might as well do it all manually
          this.selectedIndices.splice(selectionIndex, 1);
        }
      }

      let selectionIndex = findIndex(this.selected, { id: playlistId });
      if (selectionIndex !== -1) {
        this.selected.splice(selectionIndex, 1);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.v-responsive.v-image {
  background: linear-gradient(to bottom right, #575757, #adadad);
}
/deep/ .pl-0,
/deep/ .px-0 {
  & > .v-list__tile {
    padding-left: 0;
  }
}
/deep/ .pr-0,
/deep/ .px-0 {
  & > .v-list__tile {
    padding-right: 0;
  }
}
</style>
