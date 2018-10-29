<template>
  <div>

    <v-speed-dial
        v-model="fab"
        fixed bottom right
        v-if="!applyingEffectType"
        direction="left">
      <v-btn
          slot="activator"
          v-model="fab"
          fab dark color="blue">
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
        floating fixed
        style="bottom: 16px; right: 16px; left: unset; top: unset;">
      <v-btn icon dark class="green" :ripple="false"
             v-if="applyingEffectType === effectTypes.BUFF"
             @click="applyingEffectType = effectTypes.DEBUFF">
        <v-icon>trending_up</v-icon>
      </v-btn>
      <v-btn icon dark class="red" :ripple="false"
             v-if="applyingEffectType === effectTypes.DEBUFF"
             @click="applyingEffectType = effectTypes.OTHER">
        <v-icon>trending_down</v-icon>
      </v-btn>
      <v-btn icon dark class="grey" :ripple="false"
             v-if="applyingEffectType === effectTypes.OTHER"
             @click="applyingEffectType = effectTypes.BUFF">
        <v-icon>trending_flat</v-icon>
      </v-btn>

      <v-text-field
          :autofocus="!!applyingEffectType"
          hide-details single-line box
          v-model="effectToApply">
      </v-text-field>

      <v-btn icon @click="saveAppliedEffects">
        <v-icon>check</v-icon>
      </v-btn>

      <v-btn icon @click="exitApplyEffectMode">
        <v-icon>clear</v-icon>
      </v-btn>
    </v-toolbar>

    <v-container grid-list-lg class="px-0">
      <v-layout row wrap>
        <v-flex
            d-flex xs12 sm6 md4 lg3 xl2
            v-for="combatant in combatantsByInitiative"
            :key="combatant.uuid">
          <combatant-card
              :combatant="combatant"
              :effect-mode="applyingEffectType"
              :active="combatantsToApply.includes(combatant.uuid)"
              :update-func="updateOneCombatant"
              @click="toggleCombatantWillApply($event)"/>
        </v-flex>
      </v-layout>
    </v-container>

    <screen
        class="elevation-1 hidden-sm-and-down"
        :items="gmScreenTabs"
    >
      <template slot="toolbar-right">
        <v-btn flat icon :to="{ name: routeNames.GMSCREENTABS }">
          <v-icon>edit</v-icon>
        </v-btn>
      </template>
      <template slot="title" slot-scope="{ item }">
        {{ item.title }}
      </template>
      <template slot-scope="{ item }">
        <v-form v-if="item.key === 'settings'" @submit.prevent>
          <v-container>
            <v-layout row wrap>
              <v-flex md4 lg3 xl2>
                <v-select
                    readonly
                    label="Active encounter"
                    returnObject
                    :items="[getEncounter(currentCampaign.active_encounter)]"
                    item-text="name" item-value="uuid"
                    :value="currentCampaign.active_encounter"
                    append-icon="edit"
                    @click:append="goToEncounterChooser"
                ></v-select>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
        <screen-tab v-else :content="item.content"></screen-tab>
      </template>
    </screen>
    <v-card class="hidden-md-and-up">
      <v-card-text>
        The GM screen is hidden on small screens.
      </v-card-text>
    </v-card>

    <div style="height: 88px;"></div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import CombatantCard from "@/components/encounters/CombatantCard";
import Screen from "@/components/gmscreen/GMScreen";
import ScreenTab from "@/components/gmscreen/GMScreenTab";
import combatant from "@/models/combatant";
import campaign from "@/models/campaign";
import encounter from "@/models/encounter";
import gmscreentab from "@/models/gmscreentab";
import _ from "lodash";
import { ModuleSocket } from "@/utils";
import auth from "@/auth";
import { routeNames } from "@/router";

export default {
  name: "Combat",
  components: { CombatantCard, Screen, ScreenTab },
  data() {
    return {
      routeNames,

      applyingEffectType: combatant.Combatant.effectTypes.NONE,
      effectToApply: "",
      combatantsToApply: [],
      effectTypes: combatant.Combatant.effectTypes,
      socket: new ModuleSocket(this, "combat", {
        update: obj => {
          if (obj.combatants) this.setCombatant({ objAry: obj.combatants });
          if (obj.campaign) this.setCampaign({ object: obj.campaign });
        }
      }),
      fab: false
    };
  },
  computed: {
    ...mapGetters(combatant.namespace, {
      combatants: combatant.getterTypes.LIST,
      getCombatant: combatant.getterTypes.BY_ID
    }),
    ...mapGetters(auth.namespace, {
      currentCampaign: auth.getterTypes.CURRENT_CAMPAIGN
    }),
    ...mapGetters(encounter.namespace, {
      getEncounter: encounter.getterTypes.BY_ID
    }),
    ...mapGetters(gmscreentab.namespace, {
      tabs: gmscreentab.getterTypes.LIST
    }),
    gmScreenTabs() {
      return [{ key: "settings", title: "Settings" }, ...this.tabs];
    },
    combatantsByInitiative() {
      return [
        ...this.combatants.filter(
          c =>
            c.encounter === null ||
            c.encounter === this.currentCampaign.active_encounter
        )
      ].sort((a, b) => b.initiative - a.initiative);
    }
  },
  methods: {
    ...mapMutations(combatant.namespace, {
      setCombatant: combatant.mutationTypes.SET
    }),
    ...mapMutations(campaign.namespace, {
      setCampaign: campaign.mutationTypes.SET
    }),
    ...mapActions(encounter.namespace, {
      loadEncounters: encounter.actionTypes.LIST
    }),
    ...mapActions(gmscreentab.namespace, {
      loadTabs: gmscreentab.actionTypes.LIST
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
      this.applyingEffectType = combatant.Combatant.effectTypes.BUFF;
    },
    enterApplyDebuffMode() {
      this.applyingEffectType = combatant.Combatant.effectTypes.DEBUFF;
    },
    enterApplyOtherMode() {
      this.applyingEffectType = combatant.Combatant.effectTypes.OTHER;
    },
    exitApplyEffectMode() {
      this.applyingEffectType = combatant.Combatant.effectTypes.NONE;
      this.effectToApply = "";
      this.combatantsToApply = [];
    },
    async saveAppliedEffects() {
      let combatantObjs = [];
      if (this.effectToApply.length) {
        for (let uuid of this.combatantsToApply) {
          combatantObjs.push(_.cloneDeep(this.getCombatant(uuid)));
          combatantObjs[combatantObjs.length - 1].effects[
            this.applyingEffectType
          ].push(this.effectToApply);
        }
        await this.socket.update({ combatants: combatantObjs });
      }
      this.exitApplyEffectMode();
    },
    async changeActiveEncounter(newEncounter, combatantObjs = null) {
      let data = {
        campaign: {
          ...this.currentCampaign,
          active_encounter: newEncounter.uuid
        }
      };
      if (combatantObjs) data.combatants = combatantObjs;
      await this.socket.update(data);
    },
    goToEncounterChooser() {
      this.$router.push({
        name: routeNames.ENCOUNTER_CHOOSE,
        params: {
          saveFunc: this.changeActiveEncounter,
          cancelFunc: () => {}
        }
      });
    },
    updateOneCombatant: _.debounce(function(combatant) {
      this.socket.update({ combatants: [combatant] });
    }, 500)
  },
  created() {
    this.socket.connect();
    this.loadEncounters();
    this.loadTabs();
  }
};
</script>
