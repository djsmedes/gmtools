<template>
  <object-list model="combatant" :obj-detail-view-name="routeNames.COMBATANT"></object-list>
</template>

<script>
  import ObjectList from '../components/ObjectList'
  import { routeNames } from '../router'

  export default {
    name: "CombatantList",
    components: { ObjectList },
    data() {
      return {
        routeNames
      }
    }
  }
</script>
