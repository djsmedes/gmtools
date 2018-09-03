<template>
  <div class="card-deck">
    <template v-for="(combatant, uuid) in combatants">
      <combatant-card :uuid="uuid"/>
    </template>
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
        combatants: combatant.modelName
      })
    },
    methods: {
      ...mapActions(combatant.namespace, {
        loadCombatants: combatant.actionTypes.LIST
      })
    },
    data() {
      return {}
    },
    created() {
      this.loadCombatants()
    }
  }
</script>

<style scoped>

</style>
