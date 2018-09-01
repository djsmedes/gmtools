<template>
  <object-list :model="model" :obj-detail-view-name="routeNames.COMBATANT"></object-list>
</template>

<script>
  import { mapActions } from 'vuex'
  import ObjectList from '../components/ObjectList'
  import { routeNames } from '../router'
  import combatant from '../models/combatant'

  export default {
    name: "CombatantList",
    components: { ObjectList },
    data() {
      return {
        routeNames,
        model: combatant
      }
    },
    methods: {
        ...mapActions(combatant.namespace, {
          loadCombatants: combatant.actionTypes.LIST
        })
    },
    created() {
      this.loadCombatants()
    }
  }
</script>
