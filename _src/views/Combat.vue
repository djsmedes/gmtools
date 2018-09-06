<template>
  <div>
    <div class="mb-2 d-flex">
      <div class="btn-group" v-if="!applyingEffectType">
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
      <div v-else>
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
                        @click="toggleCombatantWillApply($event)"
                        @combatant-change="updateEditedCombatants($event)"/>
      </template>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import CombatantCard from '../components/CombatantCard'
  import combatant from '../models/combatant'
  import _ from 'lodash'

  export default {
    name: "Combat",
    data () {
      return {
        applyingEffectType: combatant.effectTypes.NONE,
        effectToApply: '',
        combatantsToApply: [],
        effectTypes: combatant.effectTypes,
        editMode: false,
        editedCombatants: {}
      }
    },
    components: {
      CombatantCard
    },
    computed: {
      ...mapGetters(combatant.namespace, {
        combatants: combatant.getterTypes.LIST,
        getCombatant: combatant.getterTypes.BY_ID
      }),
      combatantsByInitiative () {
        return [...this.combatants].sort((a, b) => b.initiative - a.initiative)
      }
    },
    methods: {
      ...mapActions(combatant.namespace, {
        loadCombatants: combatant.actionTypes.LIST,
        updateCombatant: combatant.actionTypes.UPDATE
      }),
      updateEditedCombatants (editedCombatant) {
        if (_.isEqual(editedCombatant, this.getCombatant(editedCombatant.uuid))) {
          delete this.editedCombatants[editedCombatant.uuid]
        } else {
          this.editedCombatants[editedCombatant.uuid] = editedCombatant
        }
      },
      enterEditMode () {
        this.exitApplyEffectMode();
        this.editMode = true;
      },
      exitEditMode () {
        this.editMode = false;
      },
      saveAppliedEdits () {
        Promise.all(
            Object.keys(this.editedCombatants).map(uuid => this.updateCombatant(this.editedCombatants[uuid]))
        ).then(() => {
          this.exitEditMode()
        })
      },
      toggleCombatantWillApply (uuid) {
        if (!this.applyingEffectType) return;
        if (this.combatantsToApply.includes(uuid)) {
          this.combatantsToApply = this.combatantsToApply.filter(item => item !== uuid)
        } else {
          this.combatantsToApply.push(uuid)
        }
      },
      enterApplyEffectMode () {
        this.exitEditMode()
      },
      enterApplyBuffMode () {
        this.enterApplyEffectMode();
        this.applyingEffectType = combatant.effectTypes.BUFF;
      },
      enterApplyDebuffMode () {
        this.enterApplyEffectMode();
        this.applyingEffectType = combatant.effectTypes.DEBUFF;
      },
      enterApplyOtherMode () {
        this.enterApplyEffectMode();
        this.applyingEffectType = combatant.effectTypes.OTHER;
      },
      exitApplyEffectMode () {
        this.applyingEffectType = combatant.effectTypes.NONE;
        this.effectToApply = '';
        this.combatantsToApply = [];
      },
      async saveAppliedEffects () {
        const effectType2apiName = {
          [combatant.effectTypes.BUFF]: 'buffs',
          [combatant.effectTypes.DEBUFF]: 'debuffs',
          [combatant.effectTypes.OTHER]: 'others'
        };


        let combatantObjs = [];
        if (this.effectToApply.length) {
          for (let uuid of this.combatantsToApply) {
            combatantObjs.push(_.cloneDeep(this.getCombatant(uuid)));
            combatantObjs[
            combatantObjs.length - 1
                ].effects[
                effectType2apiName[this.applyingEffectType]
                ].push(this.effectToApply)
          }
          await Promise.all(
              combatantObjs.map(combatant => this.updateCombatant(combatant))
          )
        }
        this.exitApplyEffectMode()
      },
      log (something) {
        console.log(something)
      }
    },
    created () {
      this.loadCombatants()
    }
  }
</script>
