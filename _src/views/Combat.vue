<template>
  <div class="card-deck">
    <template v-for="(combatant, uuid) in combatants">
      <combatant-card :combatant="combatant"/>
    </template>
    <div v-if="!tempCombatant" class="card">
      <button class="btn btn-outline-primary btn-block" @click="generateBlankCombatant">Add combatant</button>
    </div>
    <div v-else>
      ...
    </div>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import CombatantCard from '../components/CombatantCard'
  import combatant from '../models/combatant'

  export default {
    name: "Combat",
    components: {
      CombatantCard
    },
    computed: {
      ...mapState(combatant.namespace, {
        combatants: state => state[combatant.modelName]
      })
    },
    methods: {
      ...mapActions(combatant.namespace, {
        loadCombatants: combatant.actionTypes.LIST
      }),
      generateBlankCombatant() {
        this.tempCombatant = new combatant.Combatant()
      }
    },
    data() {
      return {
        tempCombatant: null
      }
    },
    created() {
      this.loadCombatants()
    }
  }
</script>
