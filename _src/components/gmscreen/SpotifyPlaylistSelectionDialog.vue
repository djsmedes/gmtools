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
                        <v-card
                          :class="{
                            'elevation-0': !hover,
                            'elevation-5': hover,
                          }"
                          :color="
                            isSelected(item) ? 'primary lighten-2' : undefined
                          "
                          @click="toggleSelected(item)"
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
                    </v-hover>
                  </v-flex>
                </template>
                <template #footer v-if="!areAllLoaded">
                  <v-fade-transition mode="out-in">
                    <v-progress-linear
                      indefinite
                      v-if="loadingFromSpotify"
                    ></v-progress-linear>
                    <v-tooltip v-else bottom>
                      <template #activator="{ on }">
                        <v-btn v-on="on" flat block @click="loadMore">
                          <v-icon large>expand_more</v-icon>
                        </v-btn>
                      </template>
                      Load more
                    </v-tooltip>
                  </v-fade-transition>
                </template>
              </v-data-iterator>
            </v-container>
          </v-flex>
          <v-flex
            xs6
            sm6
            md4
            lg3
            xl2
            class="pl-3 pt-3"
            style="overflow: auto; max-height: calc(100vh - 300px); position: relative;"
            @dragenter="parentDragEnter"
          >
            <div
              ref="dragTarget"
              class="drag-over"
              @drop.prevent="drop"
              @dragover.prevent
              @dragleave="dragLeave"
            >
              <h4 class="headline pa-3 font-weight-bold">
                Drop Spotify playlist URL here to add
              </h4>
            </div>
            <h4 class="title">
              Selected
            </h4>
            <v-list style="background: transparent;">
              <v-hover v-for="(item, index) in sortedSelected" :key="index">
                <template #default="{ hover }">
                  <v-list-tile
                    :class="{ 'mt-1': index }"
                    class="px-0"
                    :style="{
                      background: hover ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
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
                      @click="removeSelected(item)"
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
          @click="close(sortedSelected)"
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
import sortBy from "lodash/sortBy";

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
      console,
      playlists: [],
      totalPlaylistCount: null, // starts as null instead of 0 so we know if we've tried
      selected: [...this.preSelected],
      loadingFromSpotify: false,
    };
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
    sortedSelected() {
      return sortBy(this.selected, item => item.name.toLowerCase());
    },
  },
  created() {
    this.loadMore();
  },
  methods: {
    isSelected(playlist) {
      return this.selectedIds.includes(playlist.id);
    },
    toggleSelected(playlist) {
      let index = this.selectedIds.indexOf(playlist.id);
      if (index === -1) {
        this.selected.push(playlist);
      } else {
        this.selected.splice(index, 1);
      }
    },
    removeSelected(playlist) {
      let index = this.selectedIds.indexOf(playlist.id);
      if (index !== -1) {
        this.selected.splice(index, 1);
      }
    },
    async loadMore() {
      this.loadingFromSpotify = true;
      let { data } = await this.request({
        method: "get",
        url: `/me/playlists?limit=12&offset=${this.playlists.length}`,
      });
      this.playlists = this.playlists.concat(data.items);
      this.totalPlaylistCount = data.total;
      this.loadingFromSpotify = false;
    },
    getImgSrc(playlist) {
      let [tooBig, good, tooSmall] = playlist.images;
      let chosenImage = good || tooBig || tooSmall || { url: "" };
      return chosenImage.url;
    },
    async drop($event) {
      $event.target.classList.remove("drag-over__active");
      let playlistId = await this.getDraggedPlaylistId($event);
      if (playlistId) {
        let playlist = await this.getPlaylist(playlistId);
        if (playlist) {
          this.selected.push(playlist);
        }
      }
    },
    dragEnter({ target }) {
      target.classList.add("drag-over__active");
    },
    dragLeave({ target }) {
      target.classList.remove("drag-over__active");
    },
    parentDragEnter() {
      try {
        this.dragEnter({
          target: this.$refs.dragTarget,
        });
      } catch {
        // no-op
      }
    },
    async getDraggedPlaylistId($event) {
      let plainText;
      for (let dataTransferItem of $event.dataTransfer.items) {
        if (dataTransferItem.type === "text/plain") {
          plainText = await new Promise(resolve => {
            dataTransferItem.getAsString(resolve);
          });
          break;
        }
      }
      if (!plainText) {
        return;
      }
      let [queryRemoved] = plainText.split("?");
      let matches = queryRemoved.match(/[a-zA-Z0-9]+/g);
      let result = matches.pop();
      let type = matches.pop();
      if (type === "playlist") {
        return result;
      }
    },
    async getPlaylist(id) {
      let { data } = await this.request({
        method: "get",
        url: `/playlists/${id}`,
      });
      return data;
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
.drag-over {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  transition: background-color 0.25s;
  display: flex;
  align-items: center;
  & h4 {
    color: transparent;
    transition: color 0.25s;
    pointer-events: none;
  }
  &.drag-over__active {
    z-index: 5;
    background: hsla(214.2, 100%, 70.8%, 0.9);

    & h4 {
      color: white;
    }
  }
}
</style>
