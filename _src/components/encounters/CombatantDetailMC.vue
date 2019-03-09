<template>
  <v-card>
    <v-card-text>
      <v-form @submit.prevent>
        <v-text-field
          :disabled="isViewMode"
          :class="{ 'disabled-means-display': isViewMode }"
          label="Name"
          v-model="combatant.name"
        ></v-text-field>
        <v-textarea
          :disabled="isViewMode"
          :class="{ 'disabled-means-display': isViewMode }"
          auto-grow
          :rows="1"
          label="Loot"
          v-model="combatant.loot"
        ></v-textarea>
        <v-autocomplete
          label="Statblock"
          hint="Start typing to search your saved statblocks"
          v-model="combatant.statblock"
          hide-no-data
          append-icon=""
          :search-input.sync="statblockSearch"
          :items="statblockAutocompleteMatches"
          :loading="statblockAutocompleteLoading"
          @keypress="onStatblockAutocompleteKeyPress"
          @keyup.backspace="queryStatblockAutocomplete()"
          @keyup.delete="queryStatblockAutocomplete()"
          @paste.native="queryStatblockAutocomplete()"
          clearable
        ></v-autocomplete>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import ObjectDetail from "@/components/generic/ObjectDetail";
import { Combatant } from "@/models/combatant_mc";
import debounce from "lodash/debounce";
import { sleep } from "@/utils/time";
import { generateUrl } from "@/utils/urls";
import axios from "axios";

export default {
  name: "CombatantDetail",
  components: { ObjectDetail },
  props: {
    uuid: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      isViewMode: false,
      combatant: new Combatant({ uuid: this.uuid }),
      statblockSearch: "",
      statblockAutocompleteMatches: [],
      statblockAutocompleteLoading: false,
    };
  },
  methods: {
    // eslint-disable-next-line
    onStatblockAutocompleteKeyPress($event) {
      this.queryStatblockAutocomplete();
    },
    queryStatblockAutocomplete: debounce(async function() {
      let match = (this.statblockSearch || "").trim();
      if (match.length < 2) {
        return;
      }
      this.statblockAutocompleteLoading = true;
      try {
        let result = await Promise.race([
          axios.get(generateUrl(["statblock", "autocomplete"]), {
            params: {
              match,
            },
          }),
          sleep(5000),
        ]);
        this.statblockAutocompleteMatches = result ? result.data : [];
      } finally {
        this.statblockAutocompleteLoading = false;
      }
    }, 300),
  },
  created() {
    if (this.uuid) {
      this.combatant.vuex_fetch(this.$store);
    }
  },
};
</script>
