<template>
  <v-dialog
    v-model="dialog"
    :max-width="width"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    persistent
    @keydown.esc="close(null)"
  >
    <v-toolbar dark color="grey darken-2" dense>
      <v-toolbar-title>Editing Creature Property</v-toolbar-title>
    </v-toolbar>
    <v-card flat>
      <v-window v-model="windowPosition">
        <v-window-item>
          <v-container>
            <v-layout wrap align-baseline>
              <v-flex xs12 class="grey--text body-2">
                Search for an existing creature property to add
              </v-flex>
              <v-flex xs8>
                <v-autocomplete
                  v-model="existing"
                  :search-input.sync="existingSearch"
                  :items="autocompleteMatches"
                  :loading="autocompleteLoading"
                  hide-no-data
                  append-icon=""
                  clearable
                  @keypress="onAutocompleteKeyPress"
                  @keyup.backspace="queryCreaturePropAutocomplete()"
                  @keyup.delete="queryCreaturePropAutocomplete()"
                  @paste.native="queryCreaturePropAutocomplete()"
                ></v-autocomplete>
              </v-flex>
              <v-flex xs4 class="text-right">
                <v-btn
                  :disabled="!existing"
                  text
                  color="save"
                  @click="windowPosition = 1"
                >
                  preview
                  <v-icon right>arrow_forward</v-icon>
                </v-btn>
              </v-flex>
              <v-flex xs3 class="grey--text body-2">
                or
              </v-flex>
              <v-flex xs9 class="text-right">
                <v-btn
                  :disabled="!!existing"
                  text
                  color="save"
                  @click="windowPosition = 1"
                >
                  create a new creature property
                  <v-icon right>arrow_forward</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-window-item>
        <v-window-item>
          <creature-prop-detail
            v-if="windowPosition === 1"
            :uuid="selectedUuid"
          >
            <template #actions="{ saveFunc, changedFunc }">
              <v-btn text @click="close(false)">
                <v-icon left>cancel</v-icon>
                cancel & close
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                :disabled="!changedFunc()"
                text
                color="save"
                @click="saveAndClose(saveFunc)"
              >
                <v-icon left>save</v-icon>
                save & close
              </v-btn>
            </template>
          </creature-prop-detail>
        </v-window-item>
      </v-window>
    </v-card>
  </v-dialog>
</template>

<script>
import functionalDialogMixin from "@/mixins/functionalDialog";
import CreaturePropDetail from "@/views/CreaturePropDetail";
import axios from "axios";
import { generateUrl2 } from "@/utils/urls";
import debounce from "lodash/debounce";
import { sleep } from "@/utils/time";

export default {
  name: "CreaturePropDetailDialog",
  components: { CreaturePropDetail },
  mixins: [functionalDialogMixin],
  props: {
    uuid: {
      type: String,
      default: null,
    },
    parentStatblockUuid: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      windowPosition: this.uuid ? 1 : 0,
      existingSearch: null,
      existing: null,
      autocompleteMatches: [],
      autocompleteLoading: false,
    };
  },
  computed: {
    selectedUuid() {
      return this.uuid || this.existing;
    },
    width() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "220px";
        case "sm":
          return "400px";
        case "md":
          return "500px";
        case "lg":
          return "600px";
        case "xl":
          return "800px";
      }
    },
  },
  methods: {
    async saveAndClose(saveFunc) {
      let newCreatureProp = await saveFunc();
      if (this.uuid) {
        this.close(null);
      } else {
        await axios.post(generateUrl2("statblockprop"), {
          creature_prop: newCreatureProp.uuid,
          statblock: this.parentStatblockUuid,
        });
        this.close(newCreatureProp);
      }
    },
    // eslint-disable-next-line
    onAutocompleteKeyPress($event) {
      this.queryCreaturePropAutocomplete();
    },
    queryCreaturePropAutocomplete: debounce(async function() {
      let match = (this.existingSearch || "").trim();
      if (match.length < 2) {
        return;
      }
      this.autocompleteLoading = true;
      try {
        let result = await Promise.race([
          axios.get(generateUrl2("creatureprop", "autocomplete"), {
            params: {
              match,
            },
          }),
          sleep(5000),
        ]);
        this.autocompleteMatches = result ? result.data : [];
      } finally {
        this.autocompleteLoading = false;
      }
    }, 300),
  },
};
</script>
