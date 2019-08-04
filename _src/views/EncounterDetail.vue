<template>
  <pre>
    {{ JSON.stringify(encounter, null, 2) }}
  </pre>
</template>

<script>
import CombatantDetailDialog from "@/components/encounters/CombatantDetailDialog";
import { Encounter, CombatantList } from "@/models";

export default {
  name: "EncounterDetail",
  props: {
    uuid: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      encounter: new Encounter({ uuid: this.uuid }),
      combatants: new CombatantList([], {
        storeFilter: { encounter: this.uuid },
      }),
      viewMode: true,
    };
  },
  async created() {
    this.$store.commit("needLoading");
    await Promise.all([this.encounter.fetch(), this.combatants.fetch()]);
    this.$store.commit("doneLoading");
  },
  methods: {
    async deleteSelf() {
      await this.encounter.delete();
      this.$router.push({ name: this.$routeNames.ENCOUNTERS });
    },
    async openCombatantDialog(combatantUuid) {
      await this.$dialog(CombatantDetailDialog, {
        ...(combatantUuid
          ? { uuid: combatantUuid }
          : { extraAttrData: { encounter: this.uuid } }),
      });
    },
  },
};
</script>
