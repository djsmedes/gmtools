<template>
  <a class="card"
     :class="[
       { disabled: !effectMode },
       { active: active },
       { 'selectable-success': effectMode === effectTypes.BUFF },
       { 'selectable-danger': effectMode === effectTypes.DEBUFF },
       { 'selectable-secondary': effectMode === effectTypes.OTHER }
     ]"
     :href="!!effectMode ? '#' : false"
     @click.prevent="$emit('click', combatant.uuid)">
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
  </a>
</template>

<script>
  import { Combatant, effectTypes } from '../models/combatant'

  export default {
    name: "Combatant",
    props: {
      combatant: {
        type: Combatant,
        default: () => new Combatant()
      },
      effectMode: {
        default: effectTypes.NONE
      },
      active: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        localCombatant: new Combatant(this.combatant),
        effectTypes
      }
    },
    computed: {},
    methods: {},
    created () {
    }
  }
</script>

<style scoped lang="scss">
  @import '../scss/shared';

  a {
    @each $theme-color-name, $color in $theme-colors {
      &.selectable-#{$theme-color-name} {
        color: inherit;
        text-decoration: none;

        &:hover {
          color: inherit;
          text-decoration: none;
        }

        &:not(.disabled) {
          &.active {
            outline: 0;
            box-shadow: 0 0 0 0.4rem rgba($color, 0.5);
          }
          &:focus, &:active {
            outline: 0;
          }
        }
      }
    }
  }
</style>
