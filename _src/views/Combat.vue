<template>
  <div>
    <div class="mb-2">
      <button class="btn btn-primary mr-2">Blue</button>
      <button class="btn btn-success mr-2">Green</button>
      <button class="btn btn-danger">Red</button>
    </div>
    <div class="card-deck">
      <template v-for="combatant in combatants">
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
      })
    },
    data () {
      return {}
    },
    created () {
      this.loadCombatants()
    }
  }
</script>
