<template>
  <div class="card-deck">
    <template v-for="(combatant, uuid) in combatants">
      <combatant :uuid="uuid"/>
    </template>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import Combatant from '@/components/Combatant'
  import combatantModel from '../models/combatant'

  export default {
    name: "Combat",
    components: {
      Combatant
    },
    computed: {
      ...mapState(combatantModel.namespace, {
        combatants: combatantModel.modelName
      })
    },
    methods: {
      ...mapActions(combatantModel.namespace, {
        loadCombatants: combatantModel.actionTypes.LIST
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
