<template>
  <v-card>
    <object-detail-m-c
      :edit-mode.sync="editMode"
      :save-attrs="{ disabled: !combatant.changed() }"
      :delete-attrs="{ disabled: !combatant.uuid }"
      title="Combatant"
      @save="save"
      @cancel="cancel"
      @delete="tryDelete"
    >
      <v-form @submit.prevent>
        <v-text-field
          :disabled="!editMode"
          v-model="combatant.name"
          label="Name"
        ></v-text-field>
        <v-textarea
          :disabled="!editMode"
          :rows="1"
          v-model="combatant.loot"
          auto-grow
          label="Loot"
        ></v-textarea>
        <v-autocomplete
          v-model="combatant.statblock"
          :search-input.sync="statblockSearch"
          :items="statblockAutocompleteMatches"
          :loading="statblockAutocompleteLoading"
          :clearable="editMode"
          :disabled="!editMode"
          label="Statblock"
          hint="Start typing to search your saved statblocks"
          hide-no-data
          append-icon=""
          @keypress="queryStatblockAutocomplete()"
          @keyup.backspace="queryStatblockAutocomplete()"
          @keyup.delete="queryStatblockAutocomplete()"
          @paste.native="queryStatblockAutocomplete()"
        ></v-autocomplete>
      </v-form>
    </object-detail-m-c>
  </v-card>
</template>

<script>
import { Combatant } from "@/models/combatant";
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
      default: () => ({}),
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
  async created() {
    if (this.uuid) {
      await this.combatant.fetch();
      if (this.combatant.statblock) {
        this.statblockAutocompleteLoading = true;
        this.p_initialStatblock.uuid = this.combatant.statblock;
        await this.p_initialStatblock.fetch();
        this.statblockAutocompleteLoading = false;
      }
    }
  },
  methods: {
    async save() {
      this.$emit("save", await this.combatant.save());
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
          new ButtonOption(),
          new ButtonOption({
            returnVal: true,
            text: `Yes, delete ${this.combatant.name}`,
            attrs: { color: "delete" },
          }),
        ]
      );
      if (reply) {
        await this.combatant.delete();
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
};
</script>
