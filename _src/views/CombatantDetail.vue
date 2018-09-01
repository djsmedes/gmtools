<template>
  <combatant :uuid="uuid"/>
</template>

<script>
  import Combatant from '../components/Combatant'

  export default {
    name: "CombatantDetail",
    components: { Combatant },
    computed: {
      uuid() {
        return this.$route.params.uuid
      },
    }
  }
</script>
