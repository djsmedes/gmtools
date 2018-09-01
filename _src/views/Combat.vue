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
  import {actionTypes, models} from '@/api'

  export default {
    name: "Combat",
    components: {
      Combatant
    },
    computed: {
      ...mapState({
        combatants: models.COMBATANT
      })
    },
    methods: {
      ...mapActions({
        load_objects: actionTypes.LIST_OBJECTS
      })
    },
    data() {
      return {}
    },
    created() {
      this.load_objects({model: models.COMBATANT})
    }
  }
</script>

<style scoped>

</style>
