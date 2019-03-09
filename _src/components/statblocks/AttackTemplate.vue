<template>
  <span>
    &nbsp;<em class="text-capitalize">{{ attackTypeDisplay[attack_type] }}:</em>
    {{ 0 > toHit ? "-" : "+" }}{{ Math.abs(toHit) }} to hit,
    <template v-if="range_second">
      range {{ reach_range }}/{{ range_second }}
    </template>
    <template v-else>
      reach {{ reach_range }}
    </template>
    ft., {{ num_targets }} {{ num_targets === 1 ? "target" : "targets" }}. Hit:
    {{
      average_roll(
        hit_die_size,
        hit_num_damage_dice,
        creature[uses_ability_mod + "_mod"]
      )
    }}
    ({{ hit_num_damage_dice }}d{{ hit_die_size }}{{ constantDamageDisplay }})
    {{ hit_damage_type }}
    <template v-if="hit_extra_damage_dice">
      damage plus
      {{ average_roll(hit_extra_damage_die_size, hit_extra_damage_dice) }} ({{
        hit_extra_damage_dice
      }}d{{ hit_extra_damage_die_size }})
      {{ hit_extra_damage_type }}
    </template>
    damage.
  </span>
</template>

<script>
import { Statblock } from "@/models/statblock";
import { attackTypeDisplay } from "@/models/creatureprop";
import { average_roll } from "@/utils/dice";

export default {
  name: "AttackTemplate",
  props: {
    creature: Statblock,

    attack_type: null,
    uses_ability_mod: null,
    tohit_bonus_override: null,
    reach_range: null,
    range_second: null,
    num_targets: null,
    hit_num_damage_dice: null,
    hit_die_size: null,
    hit_damage_type: null,
    hit_extra_damage_dice: null,
    hit_extra_damage_die_size: null,
    hit_extra_damage_type: null,
  },
  data() {
    return {
      attackTypeDisplay,
    };
  },
  computed: {
    toHit() {
      return (
        this.tohit_bonus_override ||
        this.creature.proficiency +
          this.creature[this.uses_ability_mod + "_mod"]
      );
    },
    constantDamageDisplay() {
      if (this.creature[this.uses_ability_mod + "_mod"] > 0) {
        return " + " + this.creature[this.uses_ability_mod + "_mod"];
      }
      if (this.creature[this.uses_ability_mod + "_mod"] < 0) {
        return " - " + Math.abs(this.creature[this.uses_ability_mod + "_mod"]);
      }
      return "";
    },
  },
  methods: {
    average_roll,
  },
  filters: {
    capitalize(value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
};
</script>
