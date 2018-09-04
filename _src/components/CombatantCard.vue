<template>
  <div class="card">
    <h5 class="card-header">{{ combatant.name }}</h5>
    <div class="card-body">
      <p class="card-text">
        buffs, debuffs, and effects go here
      </p>
    </div>
    <div class="card-footer">
      <small>
        <span class="oi oi-timer" title="initiative" aria-hidden="true"></span>
        {{ combatant.initiative }}
      </small>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import combatant from '../models/combatant'

  export default {
    name: "Combatant",
    props: {
      combatant: {
        type: combatant.Combatant,
        default: () => new combatant.Combatant()
      }
    },
    data() {
      return {
        editingCombatant: null
      }
    },
    computed: {
        ...mapGetters(combatant.namespace, {
          getCombatant: combatant.getterTypes.BY_ID
        })
    },
    methods: {
        ...mapActions(combatant.namespace, {
          loadCombatants: combatant.actionTypes.LIST
        })
    },
    created() {
    }
  }
</script>
