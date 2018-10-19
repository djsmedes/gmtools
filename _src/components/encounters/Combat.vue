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

    <v-container grid-list-lg>
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

    <div style="height: 88px;"></div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import CombatantCard from "@/components/encounters/CombatantCard";
import combatant from "@/models/combatant";
import _ from "lodash";
import { ModuleSocket } from "@/websockets";

export default {
  name: "Combat",
  data() {
    return {
      applyingEffectType: combatant.Combatant.effectTypes.NONE,
      effectToApply: "",
      combatantsToApply: [],
      effectTypes: combatant.Combatant.effectTypes,
      socket: new ModuleSocket(this, "combat", {
        update: obj => this.setCombatant({ objAry: obj.combatants })
      }),
      fab: false
    };
  },
  components: {
    CombatantCard
  },
  computed: {
    ...mapGetters(combatant.namespace, {
      combatants: combatant.getterTypes.LIST,
      getCombatant: combatant.getterTypes.BY_ID
    }),
    combatantsByInitiative() {
      return [...this.combatants].sort((a, b) => b.initiative - a.initiative);
    }
  },
  methods: {
    ...mapMutations(combatant.namespace, {
      setCombatant: combatant.mutationTypes.SET
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
    updateOneCombatant: _.debounce(function(combatant) {
      this.socket.update({ combatants: [combatant] });
    }, 500)
  },
  async created() {
    await this.socket.connect();
  },
  beforeDestroy() {
    this.socket.disconnect();
  }
};
</script>
