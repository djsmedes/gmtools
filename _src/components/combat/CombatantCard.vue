<template>
  <v-card @click.native="$emit('click', combatant.uuid)"
          :raised="active"
          :class="[
       { disabled: !effectMode },
       { active: active },
       { 'selectable-success': effectMode === effectTypes.BUFF },
       { 'selectable-danger': effectMode === effectTypes.DEBUFF },
       { 'selectable-secondary': effectMode === effectTypes.OTHER }
     ]"
  >
    <v-card-title>
      <h3 class="headline mb-0">
        {{ localCombatant.name }}
      </h3>
      <v-spacer></v-spacer>
      <v-icon v-if="active">check_circle</v-icon>
    </v-card-title>
    <v-divider class="mb-0 mt-0"></v-divider>
    <v-card-text>
        <div v-if="!!localCombatant.effects[effectTypes.BUFF]">
          <a v-for="(buff, index) in localCombatant.effects[effectTypes.BUFF]"
             :key="index" href="#"
             @click.prevent.stop="$emit('effect-clicked', makeEffectId(localCombatant.uuid, effectTypes.BUFF, index))"
             class="btn btn-sm btn-success mr-1 mb-1 status-effect-success"
             :id="makeEffectId(localCombatant.uuid, effectTypes.BUFF, index)"
             :class="[{active: !!selectedEffects[makeEffectId(localCombatant.uuid, effectTypes.BUFF, index)]},
                    {disabled: !!effectMode}]">
            {{ buff }}
          </a>
        </div>
        <div v-if="!!localCombatant.effects[effectTypes.DEBUFF]">
          <a v-for="(debuff, index) in localCombatant.effects[effectTypes.DEBUFF]"
             :key="index" href="#"
             @click.prevent.stop="$emit('effect-clicked', makeEffectId(localCombatant.uuid, effectTypes.DEBUFF, index))"
             class="btn btn-sm btn-danger mr-1 mb-1 status-effect-danger"
             :id="makeEffectId(localCombatant, effectTypes.DEBUFF, index)"
             :class="[{active: !!selectedEffects[makeEffectId(localCombatant.uuid, effectTypes.DEBUFF, index)]},
                    {disabled: !!effectMode}]">
            {{ debuff }}
          </a>
        </div>
        <div v-if="!!localCombatant.effects[effectTypes.OTHER]">
          <a v-for="(other, index) in localCombatant.effects[effectTypes.OTHER]"
             :key="index" href="#"
             @click.prevent.stop="$emit('effect-clicked', makeEffectId(localCombatant.uuid, effectTypes.OTHER, index))"
             class="btn btn-sm btn-secondary mr-1 mb-1 status-effect-secondary"
             :id="makeEffectId(localCombatant, effectTypes.OTHER, index)"
             :class="[{active: !!selectedEffects[makeEffectId(localCombatant.uuid, effectTypes.OTHER, index)]},
                    {disabled: !!effectMode}]">
            {{ other }}
          </a>
        </div>
    </v-card-text>
    <v-divider class="mb-0 mt-0"></v-divider>
    <v-card-actions>
      <v-btn flat icon
             :disabled="!!effectMode"
             @click.stop="localCombatant.initiative += 1">
        <v-icon>add</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-icon>directions_run</v-icon>
      {{ localCombatant.initiative }}
      <v-spacer></v-spacer>
      <v-btn flat icon
             :disabled="!!effectMode"
             @click.stop="localCombatant.initiative -= 1">
        <v-icon>remove</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { Combatant } from "@/models/combatant";

export default {
  name: "Combatant",
  props: {
    combatant: {
      type: Combatant,
      default: () => new Combatant()
    },
    effectMode: {
      default: Combatant.effectTypes.NONE
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
  data() {
    return {
      localCombatant: new Combatant(this.combatant),
      effectTypes: Combatant.effectTypes
    };
  },
  watch: {
    localCombatant: {
      handler(newCombatant) {
        if (this.editMode) this.$emit("combatant-change", newCombatant);
      },
      deep: true
    },
    editMode(newBool) {
      if (newBool === false) {
        this.localCombatant = new Combatant(this.combatant);
      }
    },
    combatant: {
      handler(newCombatant) {
        if (!this.editMode) this.localCombatant = new Combatant(newCombatant);
      }
    }
  },
  computed: {},
  methods: {
    makeEffectId(uuid, type, index) {
      return uuid + "/" + String(type) + "/" + String(index);
    }
  },
  created() {}
};
</script>

<style scoped lang="scss">
@import "../../scss/shared";

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
        &:focus,
        &:active {
          outline: 0;
        }
      }
    }
  }
  @each $theme-color-name, $color in $theme-colors {
    &.status-effect-#{$theme-color-name} {
      outline: 0;

      &:not(.active) {
        &:focus,
        &:active {
          box-shadow: 0 0 0 0;
        }
      }

      &:not(:hover) {
        background-color: $color !important;
        border-color: $color !important;
      }

      &.active {
        box-shadow: 0
          0
          0
          0.2rem
          rgba(map_get($theme-colors, "primary"), 1) !important;
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
