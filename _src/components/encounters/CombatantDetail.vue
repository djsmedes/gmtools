<template>
  <v-card>
    <object-detail-m-c
      title="Combatant"
      :edit-mode.sync="editMode"
      @save="save"
      :save-attrs="{ disabled: !combatant.changed() }"
      @cancel="cancel"
      :delete-attrs="{ disabled: !combatant.uuid }"
      @delete="tryDelete"
    >
      <v-form @submit.prevent>
        <v-text-field
          :disabled="!editMode"
          :class="{ 'disabled-means-display': !editMode }"
          label="Name"
          v-model="combatant.name"
        ></v-text-field>
        <v-textarea
          :disabled="!editMode"
          :class="{ 'disabled-means-display': !editMode }"
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
          :clearable="editMode"
          :disabled="!editMode"
          :class="{ 'disabled-means-display': !editMode }"
        ></v-autocomplete>
      </v-form>
    </object-detail-m-c>
  </v-card>
</template>

<script>
import { Combatant } from "@/models/combatant_mc";
import { Statblock } from "@/models/statblock";
import debounce from "lodash/debounce";
import { sleep } from "@/utils/time";
import { generateUrl } from "@/utils/urls";
import axios from "axios";
import ObjectDetailMC from "@/components/generic/ObjectDetailMC";
import { ButtonOption } from "@/plugins/userChoiceDialog";

export default {
  name: "CombatantDetail",
  components: { ObjectDetailMC },
  props: {
    uuid: {
      type: String,
      default: null,
    },
    extraAttrData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      editMode: true,
      combatant: new Combatant({ uuid: this.uuid, ...this.extraAttrData }),
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
          ...(this.p_initialStatblock.uuid
            ? { [this.p_initialStatblock.uuid]: this.p_initialStatblock.name }
            : {}),
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
    async save() {
      this.$emit("save", await this.combatant.vuex_save(this.$store));
      this.editMode = false;
    },
    async cancel() {
      this.combatant.reset();
      this.$emit("cancel");
      this.editMode = false;
    },
    async tryDelete() {
      let reply = await this.$userChoice(
        "Confirm delete",
        `<p>Are you sure you want to delete ${this.combatant.name}?</p>`,
        [
          new ButtonOption({
            returnVal: true,
            text: `Yes, delete ${this.combatant.name}`,
            attrs: { color: "delete" },
          }),
          new ButtonOption(),
        ]
      );
      if (reply) {
        await this.combatant.vuex_delete(this.$store);
        // todo - this feels wrong
        if (this.$route.name === this.$routeNames.COMBATANT) {
          this.$router.push({ name: this.$routeNames.COMBATANTS });
        } else {
          this.$emit("deleted");
        }
      }
    },
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
