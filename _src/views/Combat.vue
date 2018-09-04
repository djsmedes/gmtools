<template>
  <div class="card-deck">
    <template v-for="combatant in combatants">
      <combatant-card :combatant="combatant"/>
    </template>
    <div v-if="tempCombatant">

    </div>
    <div v-else class="card">
      <button class="btn btn-outline-primary btn-block" @click="generateBlankCombatant">Add combatant</button>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import CombatantCard from '../components/CombatantCard'
  import combatant from '../models/combatant'

  export default {
    name: "Combat",
    components: {
      CombatantCard
    },
    computed: {
      ...mapGetters(combatant.namespace, {
        combatants: combatant.getterTypes.LIST
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
