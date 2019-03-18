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
            :key="combatant.uuid"
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

    <v-card v-if="$can('gm', currentCampaign)" class="hidden-sm-and-down">
      <screen :items="tabs" v-model="activeTab">
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
            :to="{ name: routeNames.GMSCREENTAB, params: { uuid: tab.uuid } }"
          >
            <v-icon>edit</v-icon>
          </v-btn>
          <v-btn v-else flat icon disabled>
            <v-icon>edit</v-icon>
          </v-btn>
          <v-btn flat icon :to="{ name: routeNames.GMSCREENTAB_CREATE }">
            <v-icon>add</v-icon>
          </v-btn>
        </template>
      </screen>
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
import { mapGetters, mapActions } from "vuex";
import CombatantCard from "@/components/encounters/CombatantCard";
import Screen from "@/components/gmscreen/GMScreen";
import ScreenTab from "@/components/gmscreen/GMScreenTab";
import EncounterChooser from "@/components/encounters/EncounterChooser";
import combatant, { Combatant } from "@/models/combatant";
import campaign from "@/models/campaign";
import encounter, { Encounter } from "@/models/encounter";
import gmscreentab, { GMScreenTab } from "@/models/gmscreentab";
import auth from "@/auth";
import { routeNames } from "@/router";

export default {
  name: "Combat",
  components: { CombatantCard, Screen, ScreenTab, EncounterChooser },
  data() {
    return {
      routeNames,

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
      localEncounter: new Encounter(),
    };
  },
  computed: {
    ...mapGetters(combatant.namespace, {
      combatants: combatant.getterTypes.LIST,
      getCombatant: combatant.getterTypes.BY_ID,
    }),
    ...mapGetters(auth.namespace, {
      currentCampaign: auth.getterTypes.CURRENT_CAMPAIGN,
    }),
    ...mapGetters(encounter.namespace, {
      getEncounter: encounter.getterTypes.BY_ID,
    }),
    ...mapGetters(gmscreentab.namespace, {
      tabs: gmscreentab.getterTypes.LIST,
    }),
    combatantsByInitiative() {
      return [
        ...this.combatants.filter(
          c =>
            c.encounter === null ||
            c.encounter === this.currentCampaign.active_encounter
        ),
      ].sort((a, b) => b.initiative - a.initiative);
    },
    tab() {
      return this.tabs[this.activeTab] || new GMScreenTab();
    },
    currentEncounter() {
      return this.getEncounter(this.currentCampaign.active_encounter);
    },
  },
  methods: {
    ...mapActions(encounter.namespace, {
      loadEncounters: encounter.actionTypes.LIST,
      updateEncounter: encounter.actionTypes.UPDATE,
    }),
    ...mapActions(gmscreentab.namespace, {
      loadTabs: gmscreentab.actionTypes.LIST,
      updateTab: gmscreentab.actionTypes.UPDATE,
    }),
    ...mapActions(combatant.namespace, {
      loadCombatants: combatant.actionTypes.LIST,
    }),
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
        await Promise.all(combatantObjs.map(c => c.vuex_fetch(this.$store)));
        await this.$ws.put({
          [combatant.namespace]: combatantObjs.map(c => {
            c[this.applyingEffectType].push(this.effectToApply);
            return c;
          }),
        });
      }
      this.exitApplyEffectMode();
    },
    async changeActiveEncounter(newEncounterUuid) {
      await this.$ws.put({
        [campaign.namespace]: [
          {
            ...this.currentCampaign,
            active_encounter: newEncounterUuid,
          },
        ],
      });
      this.changeEncounterDialog = false;
    },
    async changeTabIndex(direction) {
      let newIndex = this.activeTab + direction;
      let tabList = [...this.tabs];
      if (newIndex < 0 || newIndex >= tabList.length) {
        return;
      }
      let tab = tabList.splice(this.activeTab, 1)[0];
      tabList.splice(newIndex, 0, tab);
      let index = 0;
      await Promise.all(
        tabList.reduce((acc, cur) => {
          if (cur.order !== index) {
            acc.push(this.updateTab({ ...cur, order: index }));
          }
          index += 1;
          return acc;
        }, [])
      );
      this.activeTab = newIndex;
    },
    async completeEncounter() {
      await Promise.all([
        this.updateEncounter(
          new Encounter({
            ...this.currentEncounter,
            completion_date: new Date(),
          })
        ),
        this.changeActiveEncounter(null),
      ]);
    },
  },
  created() {
    this.loadCombatants();
    this.loadEncounters();
    this.loadTabs();
  },
};
</script>
