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
        </v-card>
      </v-flex>
      <v-flex>
        <g-m-screen
            :items="[{ title: 'Existing tab 1', disabled: true}, { title: '...', disabled: true}, { title: 'Existing tab n', disabled: true}, localTab]"
            class="elevation-1 hidden-sm-and-down"
            :tabs-slider-style="tabsSliderStyle"
            :start-active="3"
        >
          <template slot="title" slot-scope="{ item }">
            {{ item.title }}
          </template>
          <g-m-screen-tab
              slot-scope="{ item }"
              :content="item.content"
          ></g-m-screen-tab>
        </g-m-screen>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import _ from "lodash";
import GMScreenTab from "@/components/gmscreen/GMScreenTab";
import GMScreen from "@/components/gmscreen/GMScreen";

export default {
  name: "MarkdownEditor",
  components: { GMScreen, GMScreenTab },
  data() {
    return {
      localTab: { title: "New tab", content: "" },
      tabsSliderStyle: ""
    };
  },
  methods: {
    updateContent: _.debounce(function(e) {
      this.localTab.content = e;
    }, 300),
    updateTitle: _.debounce(function(e) {
      this.localTab.title = e;
    }, 300)
  }
};
</script>

<style lang="scss">
.text-monospaced textarea {
  font-family: "Monaco", courier, monospace;
}
</style>
