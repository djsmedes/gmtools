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
          @keypress="queryStatblockAutocomplete()"
          @keyup.backspace="queryStatblockAutocomplete()"
          @keyup.delete="queryStatblockAutocomplete()"
          @paste.native="queryStatblockAutocomplete()"
          clearable
        ></v-autocomplete>
      </v-form>
    </v-card-text>
    <v-layout>
      <slot
        name="actions"
        :resetFunc="combatant.reset"
        :saveFunc="async () => combatant.vuex_save($store)"
        :changedFunc="combatant.changed"
      >
        <v-btn flat @click="combatant.reset()" :disabled="!combatant.changed()">
          <v-icon left>cancel</v-icon>
          clear changes
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          flat
          @click="combatant.vuex_save($store)"
          color="save"
          :disabled="!combatant.changed()"
        >
          <v-icon left>save</v-icon>
          save
        </v-btn>
      </slot>
    </v-layout>
  </v-card>
</template>

<script>
import ObjectDetail from "@/components/generic/ObjectDetail";
import { Combatant } from "@/models/combatant_mc";
import { Statblock } from "@/models/statblock";
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
      p_statblockAutocompleteMatches: [],
      p_initialStatblock: new Statblock(),
      statblockAutocompleteLoading: false,
    };
  },
  computed: {
    statblockAutocompleteMatches: {
      get() {
        return Object.entries({
          [this.p_initialStatblock.uuid]: this.p_initialStatblock.name,
          ...this.p_statblockAutocompleteMatches,
        }).map(([uuid, name]) => ({ value: uuid, text: name }));
      },
      set(val) {
        this.p_statblockAutocompleteMatches = {
          ...this.p_statblockAutocompleteMatches,
          ...val,
        };
      },
    },
  },
  methods: {
    queryStatblockAutocomplete: debounce(async function() {
      let match = (this.statblockSearch || "").trim();
      if (match.length < 2) {
        return;
      }
      this.statblockAutocompleteLoading = true;
      try {
        let result = await Promise.race([
          axios.get(generateUrl([Statblock.modelName, "autocomplete"]), {
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
  async created() {
    if (this.uuid) {
      await this.combatant.vuex_fetch(this.$store);
      if (this.combatant.statblock) {
        this.statblockAutocompleteLoading = true;
        this.p_initialStatblock.uuid = this.combatant.statblock;
        await this.p_initialStatblock.vuex_fetch(this.$store);
        this.statblockAutocompleteLoading = false;
      }
    }
  },
};
</script>
