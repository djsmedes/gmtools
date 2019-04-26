import { Model, Collection } from "@/models/_baseVueMcClasses";
import { Combatant } from "@/models/combatant";

const modelName = "creatureprop";

export const propTypes = {
  PROPERTY: 1,
  ACTION: 2,
  LEGENDARY_ACTION: 3,
  REACTION: 4,
};

const propTypeDisplay = Object.keys(propTypes).reduce((memo, curPropType) => {
  return {
    ...memo,
    [propTypes[curPropType]]: String(curPropType)
      .replace("_", " ")
      .toLowerCase(),
  };
}, {});

export const propTypeChoices = Object.keys(propTypeDisplay).map(key => ({
  value: Number(key),
  text:
    propTypeDisplay[key].charAt(0).toUpperCase() +
    propTypeDisplay[key].slice(1),
}));

const attackTypes = {
  MELEE_WEAPON_ATTACK: 1,
  RANGED_WEAPON_ATTACK: 2,
  MELEE_SPELL_ATTACK: 3,
  RANGED_SPELL_ATTACK: 4,
};

export const attackTypeDisplay = Object.keys(attackTypes).reduce(
  (memo, curAttackType) => {
    return {
      ...memo,
      [attackTypes[curAttackType]]: String(curAttackType)
        .replace(/_/g, " ")
        .toLowerCase(),
    };
  },
  {}
);

export const attackTypeChoices = Object.keys(attackTypeDisplay).map(key => ({
  value: Number(key),
  text:
    attackTypeDisplay[key].charAt(0).toUpperCase() +
    attackTypeDisplay[key].slice(1),
}));

export class CreatureProp extends Model {
  static get modelName() {
    return modelName;
  }

  defaults() {
    return {
      uuid: null,
      campaign: null,

      title: null,
      description: null,
      save_dc_override: null,
      save_source_ability: null,
      save_ability: null,
      prop_type: null,

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
    };
  }

  get prop_type_display() {
    return propTypeDisplay[this.prop_type] || "";
  }

  get attack_type_display() {
    return attackTypeDisplay[this.attack_type] || "";
  }
}

export class CreaturePropList extends Collection {
  static get modelName() {
    return modelName;
  }

  options() {
    return {
      ...super.options(),
      model: CreatureProp,
    };
  }
}
