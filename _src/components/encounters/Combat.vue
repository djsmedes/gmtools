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

    <v-card class="hidden-sm-and-down">
      <g-m-screen :items="items">
        <template slot="title" slot-scope="{ item }">
          <template v-if="item.key === 'settings'">
            Combat
          </template>
          <template v-else>{{ item.title }}</template>
        </template>
        <template slot-scope="{ item }">
          <v-form v-if="item.key === 'settings'" @submit.prevent>
            <v-container>
              <v-layout>
                <v-flex md4 lg3 xl2>
                  <v-text-field
                      :readonly="true"
                      label="Active encounter"
                      :value="getEncounter(currentCampaign.active_encounter).name"
                      append-icon="edit"
                      @click:append="() => encounterChooserDialog = true"
                  ></v-text-field>
                  <v-dialog :width="500" persistent v-model="encounterChooserDialog">
                    <encounter-chooser
                        :save-func="changeActiveEncounter"
                        :cancel-func="() => encounterChooserDialog = false">
                    </encounter-chooser>
                  </v-dialog>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
          <v-card-text v-else>{{ item.content }}</v-card-text>
        </template>
      </g-m-screen>
    </v-card>

    <div style="height: 88px;"></div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import CombatantCard from "@/components/encounters/CombatantCard";
import GMScreen from "@/components/encounters/GMScreen";
import combatant from "@/models/combatant";
import campaign from "@/models/campaign";
import encounter from "@/models/encounter";
import _ from "lodash";
import { ModuleSocket } from "@/websockets";
import auth from "@/auth";
import EncounterChooser from "@/components/encounters/EncounterChooser";

export default {
  name: "Combat",
  components: { EncounterChooser, CombatantCard, GMScreen },
  data() {
    return {
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
      fab: false,

      // todo - pass in
      items: [
        { key: "settings" },
        {
          uuid: "979f7e",
          title: "Conditions",
          content: "This is a list of conditions"
        },
        {
          uuid: "79889ab89a",
          title: "Items",
          content: "This is a list of items"
        }
      ],

      active_encounter: null,

      encounterChooserDialog: false
    };
  },
  watch: {
    currentCampaign: {
      handler(newVal, oldVal) {
        if (
          typeof oldVal === "undefined" ||
          newVal.active_encounter !== oldVal.active_encounter
        ) {
          this.active_encounter = newVal.active_encounter;
        }
      },
      deep: true,
      immediate: true
    }
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
    async changeActiveEncounter(newEncounter) {
      await this.socket.update({
        campaign: {
          ...this.currentCampaign,
          active_encounter: newEncounter.uuid
        }
      });
      this.encounterChooserDialog = false;
    },
    updateOneCombatant: _.debounce(function(combatant) {
      this.socket.update({ combatants: [combatant] });
    }, 500)
  },
  created() {
    this.socket.connect();
    this.loadEncounters();
  },
  beforeDestroy() {
    this.socket.disconnect();
  }
};
</script>
