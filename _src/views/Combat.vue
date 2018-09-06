<template>
  <div>
    <div class="mb-2 d-flex">
      <div class="btn-group" v-if="!applyingEffectType">
        <button class="btn btn-success" @click="enterApplyBuffMode">New Buff</button>
        <button class="btn btn-danger" @click="enterApplyDebuffMode">New Debuff</button>
        <button class="btn btn-secondary" @click="enterApplyOtherMode">New Effect</button>
      </div>
      <div v-else>
        <form novalidate class="form-inline" @submit.prevent>
          <div class="input-group">
            <input type="text" class="form-control" placeholder="Enter effect...">
            <div class="input-group-append">
              <button type="submit" class="btn btn-primary">
                Apply
              </button>
              <button type="button" class="btn btn-outline-primary" @click="exitApplyEffectMode">
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
      <div class="btn-group ml-auto">
        <button class="btn btn-outline-success">Add Combatant</button>
        <button class="btn btn-outline-danger">Remove Combatant</button>
      </div>
    </div>
    <div class="card-deck">
      <template v-for="combatant in combatantsByInitiative">
        <combatant-card :combatant="combatant"/>
      </template>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import CombatantCard from '../components/CombatantCard'
  import combatant from '../models/combatant'

  export default {
    name: "Combat",
    data () {
      return {
        applyingEffectType: combatant.effectTypes.NONE
      }
    },
    components: {
      CombatantCard
    },
    computed: {
      ...mapGetters(combatant.namespace, {
        combatants: combatant.getterTypes.LIST
      }),
      combatantsByInitiative () {
        return [...this.combatants].sort((a, b) => b.initiative - a.initiative)
      }
    },
    methods: {
      ...mapActions(combatant.namespace, {
        loadCombatants: combatant.actionTypes.LIST
      }),
      enterApplyBuffMode () {
        this.applyingEffectType = combatant.effectTypes.BUFF
      },
      enterApplyDebuffMode () {
        this.applyingEffectType = combatant.effectTypes.DEBUFF
      },
      enterApplyOtherMode () {
        this.applyingEffectType = combatant.effectTypes.OTHER
      },
      exitApplyEffectMode () {
        this.applyingEffectType = combatant.effectTypes.NONE
      }
    },
    created () {
      this.loadCombatants()
    }
  }
</script>
