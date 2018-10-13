<template>
  <div>
    <div class="mb-2 d-flex">
      <div class="btn-group" v-if="!applyingEffectType && !Object.keys(selectedEffects).length">
        <button class="btn btn-success" @click="enterApplyBuffMode">
          <small><span class="oi oi-arrow-top" aria-hidden="true"></span></small>
          <span class="oi oi-arrow-top" aria-hidden="true"></span>
        </button>
        <button class="btn btn-danger" @click="enterApplyDebuffMode">
          <span class="oi oi-arrow-bottom" aria-hidden="true"></span>
          <small><span class="oi oi-arrow-bottom" aria-hidden="true"></span></small>
        </button>
        <button class="btn btn-secondary" @click="enterApplyOtherMode">
          <span class="oi oi-ellipses" aria-hidden="true"></span>
        </button>
      </div>
      <div v-else-if="!!applyingEffectType">
        <form novalidate class="form-inline" @submit.prevent="saveAppliedEffects">
          <div class="input-group">
            <input type="text" class="form-control" placeholder="Enter effect..." v-model="effectToApply">
            <div class="input-group-append">
              <button type="submit"
                      :class="[
                        {'btn-success': applyingEffectType === effectTypes.BUFF},
                        {'btn-danger': applyingEffectType === effectTypes.DEBUFF},
                        {'btn-secondary': applyingEffectType === effectTypes.OTHER},
                        {disabled: !effectToApply.length || !combatantsToApply.length }
                      ]"
                      class="btn">
                <span class="oi oi-check" title="save"></span>
              </button>
              <button type="button" class="btn btn-outline-dark" @click="exitApplyEffectMode">
                <span class="oi oi-x" title="cancel"></span>
              </button>
            </div>
          </div>
        </form>
      </div>
      <div v-else-if="!!Object.keys(selectedEffects).length" class="btn-group">
        <button class="btn btn-dark" @click="deleteSelectedEffects">
          <span class="oi oi-trash" aria-hidden="true"></span>
        </button>
        <button class="btn btn-outline-dark" @click="clearSelectedEffects">
          <span class="oi oi-x" aria-hidden="true"></span>
        </button>
      </div>
    </div>
    <v-container fluid grid-list-xl>
      <v-layout row wrap>
        <v-flex
            v-for="combatant in combatantsByInitiative"
            :key="combatant.uuid">
        <combatant-card
            :combatant="combatant"
            :effect-mode="applyingEffectType"
            :active="combatantsToApply.includes(combatant.uuid)"
            :selected-effects="selectedEffects"
            :update-func="updateOneCombatant"
            @click="toggleCombatantWillApply($event)"
            @effect-clicked="updateSelectedEffects($event)"/>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters, mapMutations } from "vuex";
import CombatantCard from "@/components/combat/CombatantCard";
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
      selectedEffects: {},
      socket: new ModuleSocket(this, "combat", {
        update: obj => this.setCombatant({ objAry: obj.combatants })
      })
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
    updateSelectedEffects(domIdClicked) {
      if (this.applyingEffectType) return;
      if (!this.selectedEffects[domIdClicked]) {
        Vue.set(this.selectedEffects, domIdClicked, true);
      } else {
        Vue.delete(this.selectedEffects, domIdClicked);
      }
    },
    async deleteSelectedEffects() {
      let effectsToRemove = Object.keys(this.selectedEffects).reduce(
        (acc, cur) => {
          let parts = cur.split("/");
          let uuid = parts[0];
          let type = parts[1];
          let index = parts[2];
          if (!acc[uuid]) acc[uuid] = {};
          if (!acc[uuid][type]) acc[uuid][type] = [];
          acc[uuid][type].push(Number(index));
          return acc;
        },
        {}
      );
      let combatantsToUpdate = [];
      for (let uuid in effectsToRemove) {
        let c = _.cloneDeep(this.getCombatant(uuid));
        for (let type in effectsToRemove[uuid]) {
          effectsToRemove[uuid][type].sort();
          for (let i = effectsToRemove[uuid][type].length - 1; i >= 0; i--) {
            c.effects[type].splice(effectsToRemove[uuid][type][i], 1);
          }
        }
        combatantsToUpdate.push(c);
      }
      await this.socket.update({ combatants: combatantsToUpdate });
      this.clearSelectedEffects();
    },
    clearSelectedEffects() {
      Object.keys(this.selectedEffects).map(key =>
        Vue.delete(this.selectedEffects, key)
      );
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
