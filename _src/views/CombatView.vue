<template>
  <div>
    <v-speed-dial
      v-model="fab"
      fixed
      bottom
      right
      v-if="!applyingEffectType"
      direction="left"
    >
      <v-btn slot="activator" v-model="fab" fab dark color="blue">
        <v-icon>more_vert</v-icon>
        <v-icon>close</v-icon>
      </v-btn>
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
        icon
        dark
        class="green"
        :ripple="false"
        v-if="applyingEffectType === effectTypes.BUFF"
        @click="applyingEffectType = effectTypes.DEBUFF"
      >
        <v-icon>trending_up</v-icon>
      </v-btn>
      <v-btn
        icon
        dark
        class="red"
        :ripple="false"
        v-if="applyingEffectType === effectTypes.DEBUFF"
        @click="applyingEffectType = effectTypes.OTHER"
      >
        <v-icon>trending_down</v-icon>
      </v-btn>
      <v-btn
        icon
        dark
        class="grey"
        :ripple="false"
        v-if="applyingEffectType === effectTypes.OTHER"
        @click="applyingEffectType = effectTypes.BUFF"
      >
        <v-icon>trending_flat</v-icon>
      </v-btn>

      <v-text-field
        :autofocus="!!applyingEffectType"
        hide-details
        single-line
        box
        v-model="effectToApply"
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
        <v-layout row wrap>
          <v-flex
            d-flex
            xs12
            sm6
            md4
            lg3
            xl2
            v-for="combatant in combatantsByInitiative"
            :key="combatant._uid"
          >
            <combatant-card
              :uuid="combatant.uuid"
              :effect-mode="applyingEffectType"
              :active="combatantsToApply.includes(combatant.uuid)"
              :large-h-p-increment="combatantLargeHPIncrement"
              @click="toggleCombatantWillApply"
            />
          </v-flex>
        </v-layout>
      </v-container>
    </v-expand-transition>

    <v-card class="hidden-sm-and-down">
      <gm-screen :items="tabs.models" v-model="activeTab">
        <template slot="toolbar-left">
          <v-btn
            flat
            icon
            :input-value="activeTab === -1"
            @click="activeTab = -1"
          >
            <v-icon>settings</v-icon>
          </v-btn>
        </template>
        <template slot="toolbar-right">
          <v-btn
            flat
            icon
            :disabled="activeTab <= 0"
            @click="changeTabIndex(-1)"
          >
            <v-icon>arrow_left</v-icon>
          </v-btn>
          <span
            class="body-2 text-uppercase"
            :style="
              activeTab === -1
                ? 'opacity: 0.7; cursor: default;'
                : 'cursor: default;'
            "
          >
            Reorder
          </span>
          <v-btn
            flat
            icon
            :disabled="activeTab >= tabs.length - 1 || activeTab < 0"
            @click="changeTabIndex(1)"
          >
            <v-icon>arrow_right</v-icon>
          </v-btn>
          <v-btn
            v-if="tab.uuid"
            flat
            icon
            :to="{ name: $routeNames.GMSCREENTAB, params: { uuid: tab.uuid } }"
          >
            <v-icon>edit</v-icon>
          </v-btn>
          <v-btn v-else flat icon disabled>
            <v-icon>edit</v-icon>
          </v-btn>
          <v-btn flat icon :to="{ name: $routeNames.GMSCREENTAB_CREATE }">
            <v-icon>add</v-icon>
          </v-btn>
        </template>
      </gm-screen>
      <v-form v-if="activeTab === -1" @submit.prevent>
        <v-container grid-list-md>
          <v-layout row wrap>
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
              <v-dialog width="500" v-model="changeEncounterDialog">
                <v-btn slot="activator" flat>
                  Change
                </v-btn>
                <encounter-chooser :reset="changeEncounterDialog">
                  <template slot="actions" slot-scope="{ selectedEncounter }">
                    <v-btn
                      flat
                      @click="changeActiveEncounter(selectedEncounter.uuid)"
                    >
                      Save
                    </v-btn>
                    <v-btn flat @click="changeEncounterDialog = false">
                      Cancel
                    </v-btn>
                  </template>
                </encounter-chooser>
              </v-dialog>
              <v-btn @click="completeEncounter" flat>
                Complete
              </v-btn>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex md4 lg3 xl2>
              <v-switch
                v-model.number="combatantLargeHPIncrement"
                :false-value="5"
                :true-value="10"
              >
                <template slot="label">
                  Larger damage increment
                </template>
              </v-switch>
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
      <v-card-text class="hidden-md-and-up">
        The GM screen is hidden on small screens.
      </v-card-text>
    </v-card>

    <div style="height: 88px;"></div>
  </div>
</template>

<script>
import CombatantCard from "@/components/encounters/CombatantCard";
import Screen from "@/components/gmscreen/GMScreen";
import EncounterChooser from "@/components/encounters/EncounterChooser";
import {
  Campaign,
  Combatant,
  CombatantList,
  Encounter,
  GMScreenTab,
  GMScreenTabList,
  currentCampaign as getCurrentCampaign,
} from "@/models";

export default {
  name: "CombatView",
  components: {
    CombatantCard,
    "gm-screen": Screen,
    EncounterChooser,
  },
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
      activeTab: -1,
      combatantLargeHPIncrement: 5,

      changeEncounterDialog: false,
      currentCampaign: getCurrentCampaign(),
      pcCombatants: new CombatantList([], { storeFilter: { encounter: null } }),
      tabs: new GMScreenTabList(),
      listenersToTearDown: [],
    };
  },
  computed: {
    combatantsByInitiative() {
      return [...this.combatants.models, ...this.pcCombatants.models].sort(
        (a, b) => b.initiative - a.initiative
      );
    },
    tab() {
      return this.tabs[this.activeTab] || new GMScreenTab();
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
    async changeActiveEncounter(newEncounterUuid) {
      this.currentCampaign.active_encounter = newEncounterUuid;
      await this.$ws.put({
        [Campaign.modelName]: [this.currentCampaign],
      });
      this.changeEncounterDialog = false;
    },
    async changeTabIndex(direction) {
      let newIndex = this.activeTab + direction;
      let tabList = [...this.tabs.models];
      if (newIndex < 0 || newIndex >= tabList.length) {
        return;
      }
      let tab = tabList.splice(this.activeTab, 1)[0];
      tabList.splice(newIndex, 0, tab);
      let promises = [];
      tabList.forEach((tab, index) => {
        if (tab.order !== index) {
          tab.order = index;
          promises.push(tab.save());
        }
      });
      await Promise.all(promises);
      this.activeTab = newIndex;
    },
    async completeEncounter() {
      let encounter = this.currentEncounter;
      encounter.completion_date = new Date();
      await Promise.all([encounter.save(), this.changeActiveEncounter(null)]);
    },
  },
  created() {
    this.pcCombatants.fetch();
    this.tabs.fetch();

    this.listenersToTearDown.push(
      this.$ws.addMessageListener(message => {
        console.log("from listener", message);
      })
    );
  },
  beforeDestroy() {
    this.listenersToTearDown.forEach(teardownFunc => teardownFunc());
  },
};
</script>
