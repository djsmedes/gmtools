<template>
  <v-container fluid grid-list-md pa-0>
    <v-layout column>
      <v-flex>
        <v-card>
          <v-card-text>
            <v-form @submit.prevent>
              <v-text-field
                :value="tab.title"
                label="Title"
                @input="updateTitle"
              ></v-text-field>
              <v-textarea
                :auto-grow="true"
                :value="tab.content"
                label="Content"
                hint="This field supports Markdown syntax"
                box
                class="text-monospaced"
                @input="updateContent"
              ></v-textarea>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn text color="save" @click="save()">
              <v-icon left>save</v-icon>
              Save
            </v-btn>
            <v-btn v-if="!tab.isNew()" text color="red" @click="tryDelete">
              <v-icon left>delete</v-icon>
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex>
        <v-card>
          <gm-screen-tab :content="tab.content || ''"></gm-screen-tab>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import debounce from "lodash/debounce";
import ScreenTab from "@/components/gmscreen/GMScreenTab";
import { GMScreenTab } from "@/models";
import { ButtonOption } from "@/plugins/userChoiceDialog";

export default {
  name: "MarkdownEditor",
  components: {
    "gm-screen-tab": ScreenTab,
  },
  props: {
    uuid: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      tab: new GMScreenTab({ uuid: this.uuid }),
    };
  },
  async created() {
    await this.tab.fetch();
  },
  methods: {
    updateContent: debounce(function(e) {
      this.tab.content = e;
    }, 300),
    updateTitle: debounce(function(e) {
      this.tab.title = e;
    }, 300),
    async save() {
      let wasNew = this.tab.isNew();
      await this.tab.update();
      if (wasNew) {
        this.$router.replace({
          name: this.$routeNames.GMSCREENTAB,
          params: { uuid: this.tab.uuid },
        });
      }
    },
    async tryDelete() {
      let reply = await this.$userChoice(
        "Confirm delete",
        `Are you sure you want to delete ${this.tab.title}? This cannot be undone.`,
        [
          new ButtonOption({
            returnVal: true,
            text: `Yes, delete ${this.tab.title}`,
            attrs: { color: "delete" },
          }),
          new ButtonOption(),
        ]
      );
      if (reply) {
        await this.tab.delete();
        this.$router.push({ name: this.$routeNames.HOME });
      }
    },
  },
};
</script>
