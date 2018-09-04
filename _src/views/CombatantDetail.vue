<template>
  <!--<div v-if="loaded">-->
    <combatant-card :combatant="getCombatant(uuid)"/>
  <!--</div>-->
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import CombatantCard from '../components/CombatantCard'
  import combatant from '../models/combatant'

  export default {
    name: "CombatantDetail",
    components: { CombatantCard },
    data() {
      return {
        loaded: false
      }
    },
    computed: {
      uuid () {
        return this.$route.params.uuid
      },
      ...mapGetters(combatant.namespace, {
        getCombatant: combatant.getterTypes.BY_ID
      })
    },
    methods: {
      ...mapActions(combatant.namespace, {
        loadCombatants: combatant.actionTypes.LIST
      })
    },
    created () {
      this.loadCombatants().then(() => this.loaded = true)
    }
  }
</script>
