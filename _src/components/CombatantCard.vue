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
      <div v-if="!!localCombatant.effects.buffs">
        <a v-for="(buff, index) in localCombatant.effects.buffs"
           href="#"
           @click.prevent.stop="$emit('effect-clicked', makeEffectId(localCombatant.uuid, effectTypes.BUFF, index))"
           class="btn btn-sm btn-success mr-1 mb-1 status-effect-success"
           :id="makeEffectId(localCombatant.uuid, effectTypes.BUFF, index)"
           :class="[{active: !!selectedEffects[makeEffectId(localCombatant.uuid, effectTypes.BUFF, index)]},
                    {disabled: !!effectMode}]">
          {{ buff }}
        </a>
      </div>
      <div v-if="!!localCombatant.effects.debuffs">
        <a v-for="(debuff, index) in localCombatant.effects.debuffs"
           href="#"
           @click.prevent.stop="$emit('effect-clicked', makeEffectId(localCombatant.uuid, effectTypes.DEBUFF, index))"
           class="btn btn-sm btn-danger mr-1 mb-1 status-effect-danger"
           :id="makeEffectId(localCombatant, effectTypes.DEBUFF, index)"
           :class="[{active: !!selectedEffects[makeEffectId(localCombatant.uuid, effectTypes.DEBUFF, index)]},
                    {disabled: !!effectMode}]">
          {{ debuff }}
        </a>
      </div>
      <div v-if="!!localCombatant.effects.others">
        <a v-for="(other, index) in localCombatant.effects.others"
           href="#"
           @click.prevent.stop="$emit('effect-clicked', makeEffectId(localCombatant.uuid, effectTypes.OTHER, index))"
           class="btn btn-sm btn-secondary mr-1 mb-1 status-effect-secondary"
           :id="makeEffectId(localCombatant, effectTypes.OTHER, index)"
           :class="[{active: !!selectedEffects[makeEffectId(localCombatant.uuid, effectTypes.OTHER, index)]},
                    {disabled: !!effectMode}]">
          {{ other }}
        </a>
      </div>


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
      },
      selectedEffects: {
        type: Object
      }
    },
    data () {
      return {
        localCombatant: new Combatant(this.combatant),
        effectTypes
      }
    },
    watch: {
      localCombatant: {
        handler (newCombatant) {
          if (this.editMode) this.$emit('combatant-change', newCombatant)
        },
        deep: true
      },
      editMode (newBool) {
        if (newBool === false) {
          this.localCombatant = new Combatant(this.combatant)
        }
      },
      combatant: {
        handler (newCombatant) {
          if (!this.editMode) this.localCombatant = new Combatant(newCombatant);
        }
      }
    },
    computed: {},
    methods: {
      makeEffectId (uuid, type, index) {
        return uuid + '_' + String(type) + '_' + String(index)
      },
    },
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
    @each $theme-color-name, $color in $theme-colors {
      &.status-effect-#{$theme-color-name} {
        outline: 0;

        &:not(.active) {
          &:focus, &:active {
            box-shadow: 0 0 0 0;
          }
        }

        &:not(:hover) {
          background-color: $color !important;
          border-color: $color !important;
        }

        &.active {
          box-shadow: 0 0 0 0.2rem rgba(map_get($theme-colors, 'primary'), 1) !important;
          color: $color !important;
          border-color: transparent !important;
          background-color: transparent !important;

          &:hover {
            color: white !important;
            background-color: $color !important;
            border-color: $color !important;
          }
        }
      }
    }
  }
</style>
