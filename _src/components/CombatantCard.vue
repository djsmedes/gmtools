<template>
  <div class="card">
    <h5 class="card-header">
      {{ localCombatant.name }}
    </h5>
    <div class="card-body">
      <p class="card-text">
        buffs, debuffs, and effects go here
      </p>
    </div>
    <div class="card-footer">
      <small>
        <span class="oi oi-timer" title="initiative" aria-hidden="true"></span>
        {{ localCombatant.initiative }}
      </small>
    </div>
  </div>
</template>

<script>
  import { Combatant } from '../models/combatant'

  export default {
    name: "Combatant",
    props: {
      combatant: {
        type: Combatant,
        default: () => new Combatant()
      }
    },
    data () {
      return {
        localCombatant: new Combatant(this.combatant),
      }
    },
    computed: {},
    methods: {},
    created () {}
  }
</script>
