<template>
  <object-detail
    :name="combatant.name || 'New Combatant'"
    :start-editing="startEditing || (!$route.params.uuid && !combatantUuid)"
    :save-func="
      saveFunc ? () => saveFunc(localCombatant) : combatant.uuid ? save : create
    "
    :clear-func="
      cancelFunc
        ? () => cancelFunc(localCombatant)
        : combatant.uuid
        ? reset
        : () => $router.go(-1)
    "
    :delete-func="
      deleteFunc
        ? () => deleteFunc(localCombatant)
        : combatant.uuid
        ? deleteSelf
        : null
    "
  >
    <v-card-text slot-scope="{ isViewMode }">
      <v-form @submit.prevent>
        <v-text-field
          :disabled="isViewMode"
          :class="{ 'disabled-means-display': isViewMode }"
          label="Name"
          v-model="localCombatant.name"
        ></v-text-field>
        <v-textarea
          :disabled="isViewMode"
          :class="{ 'disabled-means-display': isViewMode }"
          auto-grow
          :rows="1"
          label="Loot"
          v-model="localCombatant.loot"
        ></v-textarea>
        <v-autocomplete
          label="Statblock"
          hint="Start typing to search your saved statblocks"

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
  </object-detail>
</template>

<script>
import ObjectDetail from "@/components/generic/ObjectDetail";
import { mapGetters, mapActions } from "vuex";
import combatant, { Combatant } from "@/models/combatant";
import { routeNames } from "@/router";
import debounce from "lodash/debounce";
import { sleep } from "@/utils/time";
import { generateUrl } from "@/utils/urls";
import axios from "axios";

export default {
  name: "CombatantDetail",
  components: { ObjectDetail },
  props: {
    combatantUuid: {
      type: String,
      default: null,
    },
    saveFunc: {
      type: Function,
      default: null,
    },
    cancelFunc: {
      type: Function,
      default: null,
    },
    deleteFunc: {
      type: Function,
      default: null,
    },
    startEditing: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      localCombatant: new Combatant(),
      statblockSearch: "",
      statblockAutocompleteMatches: [],
      statblockAutocompleteLoading: false,
    };
  },
  computed: {
    combatant() {
      let uuid = this.combatantUuid || this.$route.params.uuid;
      return this.getCombatant(uuid);
    },
    ...mapGetters(combatant.namespace, {
      getCombatant: combatant.getterTypes.BY_ID,
    }),
  },
  watch: {
    combatant: {
      handler() {
        this.reset();
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions(combatant.namespace, {
      loadCombatants: combatant.actionTypes.LIST,
      deleteCombatant: combatant.actionTypes.DESTROY,
      updateCombatant: combatant.actionTypes.UPDATE,
      createCombatant: combatant.actionTypes.CREATE,
    }),
    async deleteSelf() {
      await this.deleteCombatant(this.combatant.uuid);
      this.$router.push({ name: routeNames.COMBATANTS });
    },
    async save() {
      await this.updateCombatant(this.localCombatant);
      this.reset();
    },
    async create() {
      let rObj = await this.createCombatant(this.localCombatant);
      this.$router.replace({
        name: routeNames.COMBATANT,
        params: { uuid: rObj.uuid },
      });
    },
    reset() {
      this.localCombatant = new Combatant(this.combatant);
    },
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
    this.loadCombatants();
  },
};
</script>
