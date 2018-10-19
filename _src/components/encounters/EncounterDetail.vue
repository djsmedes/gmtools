<template>
  <div>

  </div>
</template>

<script>
import ObjectDetail from "@/components/generic/ObjectDetail";
import { mapGetters, mapActions } from "vuex";
import encounter, { Encounter } from "@/models/encounter";
import combatant from "@/models/combatant";
import { routeNames } from "@/router";

export default {
  name: "EncounterDetail",
  components: { ObjectDetail },
  data() {
    return {
      localEncounter: new Encounter()
    };
  },
  computed: {
    encounter() {
      let uuid = this.$route.params.uuid;
      return uuid ? this.getEncounter(uuid) : new Encounter();
    },
    ...mapGetters(encounter.namespace, {
      getEncounter: encounter.getterTypes.BY_ID
    }),
    ...mapGetters(combatant.namespace, {
      getCombatant: combatant.getterTypes.BY_ID
    })
  },

  methods: {
    ...mapActions(encounter.namespace, {
      loadEncounters: encounter.actionTypes.LIST,
      deleteEncounter: encounter.actionTypes.DESTROY,
      updateEncounter: encounter.actionTypes.UPDATE,
      createEncounter: encounter.actionTypes.CREATE
    }),
    ...mapActions(combatant.namespace, {
      loadUsers: combatant.actionTypes.LIST
    }),
    async deleteSelf() {
      await this.deleteEncounter(this.encounter.uuid);
      this.$router.push({ name: routeNames.ENCOUNTERS });
    },
    async save() {
      await this.updateEncounter(this.localEncounter);
      this.reset();
    },
    async create() {
      let rObj = await this.createEncounter(this.localEncounter);
      this.$router.replace({
        name: routeNames.ENCOUNTER,
        params: { uuid: rObj.uuid }
      });
    },
    reset() {
      this.localEncounter = new Encounter(this.encounter);
    }
  },
  created() {
    this.loadEncounters().then(() => {
      this.reset();
      if (this.$route.params.uuid && !this.encounter.uuid) {
        this.$router.replace({ name: routeNames.NOT_FOUND });
      }
    });
    this.loadUsers();
  }
};
</script>
