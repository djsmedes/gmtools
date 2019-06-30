<template>
  <span>
    &nbsp;<em class="text-capitalize">{{ attackTypeDisplay[creatureProp.attack_type] }}:</em>
    {{ 0 > toHit ? "-" : "+" }}{{ Math.abs(toHit) }} to hit,
    <template v-if="creatureProp.range_second">
      range {{ creatureProp.reach_range }}/{{ creatureProp.range_second }}
    </template>
    <template v-else>
      reach {{ creatureProp.reach_range }}
    </template>
    ft., {{ creatureProp.num_targets }}
    {{ creatureProp.num_targets === 1 ? "target" : "targets" }}. Hit:
    {{
      average_roll(
        creatureProp.hit_die_size,
        creatureProp.hit_num_damage_dice,
        creature[creatureProp.uses_ability_mod + "_mod"]
      )
    }}
    ({{ creatureProp.hit_num_damage_dice }}d{{ creatureProp.hit_die_size }}{{ constantDamageDisplay }})
    {{ creatureProp.hit_damage_type }}
    <template v-if="creatureProp.hit_extra_damage_dice">
      damage plus
      {{ average_roll(creatureProp.hit_extra_damage_die_size, creatureProp.hit_extra_damage_dice) }}
      ({{ creatureProp.hit_extra_damage_dice }}d{{ creatureProp.hit_extra_damage_die_size }})
      {{ creatureProp.hit_extra_damage_type }}
    </template>
    damage.
  </span>
</template>

<script>
import { Statblock, CreatureProp, attackTypeDisplay } from "@/models";
import { average_roll } from "@/utils/dice";

export default {
  name: "AttackTemplate",
  props: {
    creature: Statblock,
    creatureProp: CreatureProp,
  },
  data() {
    return {
      attackTypeDisplay,
    };
  },
  computed: {
    toHit() {
      return (
        this.creatureProp.tohit_bonus_override ||
        this.creature.proficiency +
          this.creature[this.creatureProp.uses_ability_mod + "_mod"]
      );
    },
    constantDamageDisplay() {
      if (this.creature[this.creatureProp.uses_ability_mod + "_mod"] > 0) {
        return " + " + this.creature[this.creatureProp.uses_ability_mod + "_mod"];
      }
      if (this.creature[this.creatureProp.uses_ability_mod + "_mod"] < 0) {
        return " - " + Math.abs(this.creature[this.creatureProp.uses_ability_mod + "_mod"]);
      }
      return "";
    },
  },
  methods: {
    average_roll,
  },
  filters: {
    // todo - make this global? look at efficiency both time and space depending on where defined
    capitalize(value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
};
</script>
