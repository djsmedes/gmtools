import { ModelVuexModule } from "./_baseModule";

export class Combatant {
  static get modelName() {
    return "combatant";
  }

  constructor({
    uuid = "",
    name = "",
    initiative = 0,
    hp = 0,
    effects = "{}"
  } = {}) {
    this.uuid = uuid;
    this.name = name;
    this.initiative = initiative;
    this.hp = hp;
    this.effects = effects;
  }

  get initiative() {
    return this._initiative;
  }

  set initiative(val) {
    this._initiative = Number(val);
  }

  get hp() {
    return this._hp;
  }

  set hp(val) {
    this._hp = Number(val);
  }

  get effects() {
    return this._effects;
  }

  set effects(val) {
    if (typeof val === "string") {
      this._effects = !val.length ? null : JSON.parse(val);
    } else {
      this._effects = val;
    }
    if (this._effects === null) this._effects = {};
    if (typeof this._effects[Combatant.effectTypes.BUFF] === "undefined") {
      this._effects[Combatant.effectTypes.BUFF] = [];
    }
    if (typeof this._effects[Combatant.effectTypes.DEBUFF] === "undefined") {
      this._effects[Combatant.effectTypes.DEBUFF] = [];
    }
    if (typeof this._effects[Combatant.effectTypes.OTHER] === "undefined") {
      this._effects[Combatant.effectTypes.OTHER] = [];
    }
  }

  toJSON() {
    return {
      uuid: this.uuid,
      name: this.name,
      initiative: this.initiative,
      hp: this.hp,
      effects: JSON.stringify(this.effects)
    };
  }

  static get effectTypes() {
    return {
      NONE: "",
      BUFF: "buffs",
      DEBUFF: "debuffs",
      OTHER: "others"
    };
  }
}

class CombatantVuexModule extends ModelVuexModule {
  constructor() {
    super(Combatant);
  }
}

export default {
  Combatant,
  ...new CombatantVuexModule()
};
