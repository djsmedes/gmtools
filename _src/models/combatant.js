import { Model, Collection } from "./_baseVueMcClasses";

const modelName = "combatant";

export class Combatant extends Model {
  static get modelName() {
    return modelName;
  }

  defaults() {
    return {
      uuid: null,
      campaign: null,
      encounter: null,
      name: null,
      initiative: 0,
      initiative_bonus: 0,
      hp: 0,
      max_hp: 0,
      temp_hp: 0,
      loot: null,
      buffs: [],
      debuffs: [],
      others: [],
      statblock: null,
    };
  }

  mutations() {
    return Object.entries(super.mutations()).reduce(
      (accumulator, [key, value]) => {
        if (["buffs", "debuffs", "others"].includes(key)) {
          return { ...accumulator, [key]: [...value, v => v || []] };
        } else {
          return { ...accumulator, [key]: value };
        }
      },
      {}
    );
  }
}

export class CombatantList extends Collection {
  static get modelName() {
    return modelName;
  }

  options() {
    return {
      ...super.options(),
      model: Combatant,
    };
  }
}
