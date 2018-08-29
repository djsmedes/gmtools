<template>
  <div class="card-deck">
  <template v-for="(combatant, uuid) in combatants">
    <combatant :combatant="combatant"/>
  </template>
  </div>
</template>

<script>
  import Combatant from '@/components/Combatant'

  export default {
    name: "Combat",
    components: {
      Combatant
    },
    data() {
      return {
        combatants: {
          1: {
            name: 'Berion Garfunkel',
            initiative: 14
          },
          2: {
            name: 'Elycia Greenfield',
            initiative: 10
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>