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
      <template v-if="localCombatant.effects">
        <p v-for="buff in localCombatant.effects.buffs">
          {{ buff }}
        </p>
      </template>
    </div>
    <div class="card-footer" v-if="!editMode">
      <span class="oi oi-timer" title="initiative" aria-hidden="true"></span>
      {{ localCombatant.initiative }}
    </div>
    <div class="card-footer" v-else>
      <form class="form-inline" novalidate @submit.prevent>
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text">
              <small><span class="oi oi-timer"></span></small>
            </span>
          </div>
          <input class="form-control"
                 placeholder="Initiative"
                 type="number"
                 v-model="localCombatant.initiative"/>
          <div class="input-group-append">
            <button class="btn btn-primary" type="submit">
              <span class="oi oi-check"></span>
            </button>
          </div>
        </div>
      </form>
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
      },
      editMode: {
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
    watch: {
      combatant (newCombatant) {
        console.log('combatant changed', newCombatant)
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
