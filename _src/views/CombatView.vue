<template>
  <div>
    <v-speed-dial
      v-if="!applyingEffectType"
      v-model="fab"
      fixed
      bottom
      right
      direction="left"
    >
      <template #activator="{ on }">
        <v-btn v-model="fab" fab dark color="blue" v-on="on">
          <v-icon>more_vert</v-icon>
          <v-icon>close</v-icon>
        </v-btn>
      </template>
      <v-btn fab dark small color="grey" @click="enterApplyOtherMode">
        <v-icon>trending_flat</v-icon>
      </v-btn>
      <v-btn fab dark small color="red" @click="enterApplyDebuffMode">
        <v-icon>trending_down</v-icon>
      </v-btn>
      <v-btn fab dark small color="green" @click="enterApplyBuffMode">
        <v-icon>trending_up</v-icon>
      </v-btn>
    </v-speed-dial>

    <v-toolbar
      v-if="!!applyingEffectType"
      floating
      fixed
      style="bottom: 16px; right: 16px; left: unset; top: unset;"
    >
      <v-btn
        v-if="applyingEffectType === effectTypes.BUFF"
        :ripple="false"
        icon
        dark
        class="green"
        @click="applyingEffectType = effectTypes.DEBUFF"
      >
        <v-icon>trending_up</v-icon>
      </v-btn>
      <v-btn
        v-if="applyingEffectType === effectTypes.DEBUFF"
        :ripple="false"
        icon
        dark
        class="red"
        @click="applyingEffectType = effectTypes.OTHER"
      >
        <v-icon>trending_down</v-icon>
      </v-btn>
      <v-btn
        v-if="applyingEffectType === effectTypes.OTHER"
        :ripple="false"
        icon
        dark
        class="grey"
        @click="applyingEffectType = effectTypes.BUFF"
      >
        <v-icon>trending_flat</v-icon>
      </v-btn>

      <v-text-field
        :autofocus="!!applyingEffectType"
        v-model="effectToApply"
        hide-details
        single-line
        box
      >
      </v-text-field>

      <v-btn icon @click="saveAppliedEffects">
        <v-icon>check</v-icon>
      </v-btn>

      <v-btn icon @click="exitApplyEffectMode">
        <v-icon>clear</v-icon>
      </v-btn>
    </v-toolbar>

    <v-expand-transition mode="out-in">
      <v-container
        v-if="combatantsByInitiative.length"
        grid-list-lg
        class="px-0"
      >
        <v-layout wrap>
          <v-flex
            v-for="combatant in combatantsByInitiative"
            :key="combatant._uid"
            d-flex
            xs12
            sm6
            md4
            lg3
            xl2
          >
            <combatant-card
              :combatant="combatant"
              :effect-mode="applyingEffectType"
              :active="combatantsToApply.includes(combatant.uuid)"
              :large-h-p-increment="combatantLargeHPIncrement"
              @click="toggleCombatantWillApply"
            />
          </v-flex>
        </v-layout>
      </v-container>
    </v-expand-transition>

    <combat-control-center class="hidden-sm-and-down">
      <template #settings>
        <v-form @submit.prevent>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <h6 class="title">
                  <span class="grey--text text--darken-1 font-weight-light">
                    Encounter:
                  </span>
                  <span class="text--black">
                    {{ currentEncounter.name || "--" }}
                  </span>
                </h6>
              </v-flex>
              <v-flex xs12>
                <v-btn text @click="tryChangeEncounter">
                  Change
                </v-btn>
                <v-btn text @click="completeEncounter">
                  Complete
                </v-btn>
              </v-flex>
            </v-layout>
            <v-layout wrap>
              <v-flex md4 lg3 xl2>
                <v-switch
                  v-model.number="combatantLargeHPIncrement"
                  :false-value="5"
                  :true-value="10"
                >
                  <template #label>
                    Larger damage increment
                  </template>
                </v-switch>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </template>
    </combat-control-center>

    <div style="height: 88px;"></div>
  </div>
</template>

<script>
import CombatantCard from "@/components/encounters/CombatantCard";
import ChangeEncounterDialog from "@/components/encounters/ChangeEncounterDialog";
import {
  Campaign,
  Combatant,
  CombatantList,
  Encounter,
  getCurrentCampaign,
} from "@/models";
import { wsMessageMixin } from "@/mixins";
import CombatControlCenter from "@/components/gmscreen/CombatControlCenter";

export default {
  name: "CombatView",
  components: {
    CombatControlCenter,
    CombatantCard,
  },
  mixins: [wsMessageMixin],
  data() {
    return {
      applyingEffectType: "",
      effectToApply: "",
      combatantsToApply: [],
      effectTypes: {
        NONE: "",
        BUFF: "buffs",
        DEBUFF: "debuffs",
        OTHER: "others",
      },
      fab: false,
      combatantLargeHPIncrement: 5,

      currentCampaign: getCurrentCampaign(),
      pcCombatants: new CombatantList([], { storeFilter: { encounter: null } }),
    };
  },
  computed: {
    combatantsByInitiative() {
      return [...this.combatants.models, ...this.pcCombatants.models].sort(
        (a, b) => b.initiative - a.initiative
      );
    },
    currentEncounter() {
      let encounter = new Encounter({
        uuid: this.currentCampaign.active_encounter,
      });
      encounter.fetch();
      return encounter;
    },
    combatants() {
      let collection = new CombatantList();
      if (this.currentEncounter.uuid) {
        collection.setOption("storeFilter", {
          encounter: this.currentEncounter.uuid,
        });
        collection.fetch();
      }
      return collection;
    },
  },
  created() {
    this.pcCombatants.fetch();
  },
  methods: {
    toggleCombatantWillApply(uuid) {
      if (!this.applyingEffectType) return;
      if (this.combatantsToApply.includes(uuid)) {
        this.combatantsToApply = this.combatantsToApply.filter(
          item => item !== uuid
        );
      } else {
        this.combatantsToApply.push(uuid);
      }
    },
    enterApplyBuffMode() {
      this.applyingEffectType = "buffs";
    },
    enterApplyDebuffMode() {
      this.applyingEffectType = "debuffs";
    },
    enterApplyOtherMode() {
      this.applyingEffectType = "others";
    },
    exitApplyEffectMode() {
      this.applyingEffectType = "";
      this.effectToApply = "";
      this.combatantsToApply = [];
    },
    async saveAppliedEffects() {
      if (this.effectToApply.length) {
        let combatantObjs = this.combatantsToApply.map(
          uuid => new Combatant({ uuid: uuid })
        );
        await Promise.all(combatantObjs.map(c => c.fetch()));
        await this.$ws.put({
          [Combatant.modelName]: combatantObjs.map(c => {
            c[this.applyingEffectType].push(this.effectToApply);
            return c;
          }),
        });
      }
      this.exitApplyEffectMode();
    },
    async changeActiveEncounter(uuid) {
      this.currentCampaign.active_encounter = uuid;
      await this.$ws.put({
        [Campaign.modelName]: [this.currentCampaign],
      });
    },
    async tryChangeEncounter() {
      let newEncounterUuid = await this.$dialog(ChangeEncounterDialog);
      if (newEncounterUuid) {
        this.changeActiveEncounter(newEncounterUuid);
      }
    },
    async completeEncounter() {
      let encounter = this.currentEncounter;
      encounter.completion_date = new Date();
      await Promise.all([encounter.save(), this.changeActiveEncounter(null)]);
    },
    onWsMessage(message) {
      let { /* action, */ namespace, data } = message;
      let objectList = null;
      switch (namespace) {
        case "combatant":
          objectList = this.combatantsByInitiative;
          break;
        case "encounter":
          // do something with encounter
          break;
      }
      data.forEach(obj => {
        let corresponding = objectList.find(tst => tst.uuid === obj.uuid);
        corresponding.update(obj);
        corresponding.sync();
      });
    },
  },
};
</script>
