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
      <div class="btn-group ml-auto" v-if="!editMode">
        <button class="btn btn-outline-success">
          <small><span class="oi oi-plus" aria-hidden="true"></span></small>
          <span class="oi oi-person" aria-hidden="true"></span>
        </button>
        <button class="btn btn-outline-danger">
          <small><span class="oi oi-minus" aria-hidden="true"></span></small>
          <span class="oi oi-person" aria-hidden="true"></span>
        </button>
        <button class="btn btn-outline-primary"
                @click="enterEditMode">
          <small><span class="oi oi-pencil" aria-hidden="true"></span></small>
          <span class="oi oi-person" aria-hidden="true"></span>
        </button>
      </div>
      <div class="btn-group ml-auto" v-else>
        <button class="btn btn-primary" @click="saveAppliedEdits">
          <span class="oi oi-check"></span>
        </button>
        <button class="btn btn-outline-dark" @click="exitEditMode">
          <span class="oi oi-x"></span>
        </button>
      </div>
    </div>
    <div class="card-deck">
      <template v-for="combatant in combatantsByInitiative">
        <combatant-card :combatant="combatant"
                        :effect-mode="applyingEffectType"
                        :active="combatantsToApply.includes(combatant.uuid)"
                        :edit-mode="editMode"
                        :selected-effects="selectedEffects"
                        :key="combatant.uuid"
                        @click="toggleCombatantWillApply($event)"
                        @combatant-change="updateEditedCombatants($event)"
                        @effect-clicked="updateSelectedEffects($event)"/>
      </template>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters, mapActions, mapMutations } from "vuex";
import CombatantCard from "./CombatantCard";
import combatant from "../../models/combatant";
import _ from "lodash";

export default {
  name: "Combat",
  data() {
    return {
      applyingEffectType: combatant.Combatant.effectTypes.NONE,
      effectToApply: "",
      combatantsToApply: [],
      effectTypes: combatant.Combatant.effectTypes,
      editMode: false,
      editedCombatants: {},
      selectedEffects: {}
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
    ...mapActions(combatant.namespace, {
      loadCombatants: combatant.actionTypes.LIST,
      updateCombatant: combatant.actionTypes.UPDATE
    }),
    updateEditedCombatants(editedCombatant) {
      if (_.isEqual(editedCombatant, this.getCombatant(editedCombatant.uuid))) {
        delete this.editedCombatants[editedCombatant.uuid];
      } else {
        this.editedCombatants[editedCombatant.uuid] = editedCombatant;
      }
    },
    enterEditMode() {
      this.exitApplyEffectMode();
      this.editMode = true;
    },
    exitEditMode() {
      this.editMode = false;
    },
    async saveAppliedEdits() {
      await Promise.all(
        Object.keys(this.editedCombatants).map(uuid =>
          this.updateCombatant(this.editedCombatants[uuid])
        )
      );
      this.exitEditMode();
    },
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
    enterApplyEffectMode() {
      this.exitEditMode();
    },
    enterApplyBuffMode() {
      this.enterApplyEffectMode();
      this.applyingEffectType = combatant.Combatant.effectTypes.BUFF;
    },
    enterApplyDebuffMode() {
      this.enterApplyEffectMode();
      this.applyingEffectType = combatant.Combatant.effectTypes.DEBUFF;
    },
    enterApplyOtherMode() {
      this.enterApplyEffectMode();
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
        await Promise.all(
          combatantObjs.map(combatant => this.updateCombatant(combatant))
        );
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
          let parts = cur.split("_");
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
      await Promise.all(
        combatantsToUpdate.map(combatant => this.updateCombatant(combatant))
      );
      this.clearSelectedEffects();
    },
    clearSelectedEffects() {
      Object.keys(this.selectedEffects).map(key =>
        Vue.delete(this.selectedEffects, key)
      );
    }
  },
  created() {
    this.loadCombatants();
    this.$connect("ws://localhost:8080/ws/combat/", { format: "json" });
    this.$options.sockets.onmessage = msg => console.log(JSON.parse(msg.data));
  },
  beforeDestroy() {
    this.$disconnect();
  }
};
</script>
