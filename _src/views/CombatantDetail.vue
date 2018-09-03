<template>
  <combatant-card :uuid="uuid"/>
</template>

<script>
  import CombatantCard from '../components/CombatantCard'

  export default {
    name: "CombatantDetail",
    components: { CombatantCard },
    computed: {
      uuid() {
        return this.$route.params.uuid
      },
    }
  }
</script>
