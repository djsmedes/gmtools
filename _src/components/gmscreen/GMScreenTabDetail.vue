<template>
  <v-container fluid grid-list-md pa-0>
    <v-layout column>
      <v-flex>
        <v-card>
          <v-card-text>
            <v-form @submit.prevent>
              <v-text-field
                  label="Title"
                  :value="localTab.title"
                  @input="updateTitle"
              ></v-text-field>
              <v-textarea
                  label="Content"
                  hint="This field supports Markdown syntax"
                  box
                  class="text-monospaced"
                  :auto-grow="true"
                  :value="localTab.content"
                  @input="updateContent"
              ></v-textarea>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn v-if="tab.uuid" flat @click="save">
              Save
            </v-btn>
            <v-btn v-else flat @click="create">
              Save
            </v-btn>
            <v-btn flat color="red" v-if="tab.uuid" @click="deleteDialog = true">
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex>
        <screen
            :items="[localTab]"
            class="elevation-1 hidden-sm-and-down"
        >
          <template slot="title" slot-scope="{ item }">
            {{ item.title }}
          </template>
          <screen-tab
              slot-scope="{ item }"
              :content="item.content"
          ></screen-tab>
        </screen>
        <v-card class="hidden-md-and-up">
          <v-card-text>
            The GM screen is hidden on small screens.
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-dialog width=500 v-model="deleteDialog">
      <v-card>
        <v-card-text>
          Are you sure you want to delete this GM screen tab? This cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-btn flat color="red" @click="deleteSelf">
            Delete
          </v-btn>
          <v-btn flat @click="deleteDialog = false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import _ from "lodash";
import ScreenTab from "@/components/gmscreen/GMScreenTab";
import Screen from "@/components/gmscreen/GMScreen";
import gmscreentab, { GMScreenTab } from "@/models/gmscreentab";
import { routeNames } from "@/router";

export default {
  name: "MarkdownEditor",
  components: { Screen, ScreenTab },
  props: {
    uuid: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      deleteDialog: false,
      localTab: new GMScreenTab({ title: "New tab" })
    };
  },
  computed: {
    ...mapGetters(gmscreentab.namespace, {
      getTab: gmscreentab.getterTypes.BY_ID
    }),
    tab() {
      return this.getTab(this.uuid);
    }
  },
  methods: {
    ...mapActions(gmscreentab.namespace, {
      createTab: gmscreentab.actionTypes.CREATE,
      updateTab: gmscreentab.actionTypes.UPDATE,
      loadTabs: gmscreentab.actionTypes.LIST,
      deleteTab: gmscreentab.actionTypes.DESTROY
    }),
    updateContent: _.debounce(function(e) {
      this.localTab.content = e;
    }, 300),
    updateTitle: _.debounce(function(e) {
      this.localTab.title = e;
    }, 300),
    async save() {
      await this.updateTab(this.localTab);
    },
    async create() {
      let newTab = await this.createTab(this.localTab);
      this.localTab = _.cloneDeep(newTab);
      this.$router.replace({
        name: routeNames.GMSCREENTAB,
        params: { uuid: newTab.uuid }
      });
    },
    async deleteSelf() {
      await this.deleteTab(this.uuid);
      this.$router.push({ name: routeNames.GMSCREENTABS });
    }
  },
  async created() {
    await this.loadTabs();
    if (this.tab.uuid) this.localTab = _.cloneDeep(this.tab);
  }
};
</script>
