<template>
  <v-container fluid grid-list-md pa-0>
    <v-layout column>
      <v-flex>
        <v-card>
          <v-card-actions>
            <v-btn flat @click="save">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex>
        <screen
            :items="localTabList"
            class="elevation-1 hidden-sm-and-down"
            v-model="activeTab"
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
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import gmscreentab from "@/models/gmscreentab";
import Screen from "@/components/gmscreen/GMScreen";
import ScreenTab from "@/components/gmscreen/GMScreenTab";

export default {
  name: "GMScreenTabList",
  components: { Screen, ScreenTab },
  data() {
    return {
      localTabList: [],
      activeTab: 0
    };
  },
  computed: {
    ...mapGetters(gmscreentab.namespace, {
      tabs: gmscreentab.getterTypes.LIST
    }),
    orderedTabs() {
      return [...this.tabs].sort((a, b) => {
        if (a.order === b.order) return 0;
        if (a.order === null) return 1;
        if (b.order === null) return -1;
        return a.order - b.order;
      });
    }
  },
  methods: {
    ...mapActions(gmscreentab.namespace, {
      loadTabs: gmscreentab.actionTypes.LIST,
      updateTab: gmscreentab.actionTypes.UPDATE
    }),
    async save() {
      let index = 0;
      await Promise.all(
        this.orderedTabs.reduce((acc, cur) => {
          if (cur.order !== index) {
            acc.push(this.updateTab({ ...cur, order: index }));
          }
          index += 1;
          return acc;
        }, [])
      );
    }
  },
  async created() {
    await this.loadTabs();
    this.localTabList = [...this.orderedTabs];
  }
};
</script>
