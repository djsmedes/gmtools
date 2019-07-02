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
      <div style="overflow: auto; max-height: calc(100vh - 300px)">
        <v-data-table
          :items="playlists"
          v-model="selected"
          select-all
          :headers="[
            {
              text: 'Playlist',
              value: 'name',
              sortable: false,
            },
          ]"
          :rows-per-page-items="[-1]"
          hide-actions
        >
          <template #items="props">
            <tr
              :active="props.selected"
              @click="props.selected = !props.selected"
              style="cursor: pointer;"
            >
              <td>
                <v-checkbox
                  :input-value="props.selected"
                  primary
                  hide-details
                ></v-checkbox>
              </td>
              <td>{{ props.item.name }}</td>
            </tr>
          </template>
          <template #footer v-if="!areAllLoaded">
            <tr @click="loadMore" style="cursor: pointer;">
              <td></td>
              <td>
                Load more...
              </td>
            </tr>
          </template>
        </v-data-table>
      </div>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :disabled="!selected.length" @click="save(selected)">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { functionalDialogMixin } from "@/mixins";

export default {
  name: "SpotifyPlaylistSelectionDialog",
  mixins: [functionalDialogMixin],
  props: {
    axios: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      selected: [],
      playlists: [],
      totalPlaylistCount: null, // starts as null instead of 0 so we know if we've tried
    };
  },
  computed: {
    areAllLoaded() {
      return this.playlists.length === this.totalPlaylistCount;
    },
  },
  created() {
    this.loadMore();
  },
  methods: {
    async loadMore() {
      let { data } = await this.axios(
        `/me/playlists?limit=10&offset=${this.playlists.length}`
      );
      this.playlists.push(...data.items);
      this.totalPlaylistCount = data.total;
    },
    getImageSrc(playlist) {
      let src;
      for (let image of playlist.images) {
        src = image.url;
        if (image.width < 600) {
          break;
        }
      }
      return src;
    },
  },
};
</script>

<style scoped>
/deep/ .theme--light.v-table tfoot tr:hover {
  background: #eee;
}
/deep/ table.v-table tfoot td {
  font-weight: 400;
  font-size: 13px;
}
</style>
