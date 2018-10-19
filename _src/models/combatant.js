import { CampaignDependentVuexModule } from "./_needsCampaignModule";

export class Combatant {
  static get modelName() {
    return "combatant";
  }

  constructor({
    uuid = null,
    campaign = "",
    name = "",
    initiative = 0,
    hp = 0,
    max_hp = 0,
    effects = "{}",
    loot = "",
    encounter = null
  } = {}) {
    this.uuid = uuid;
    this.name = name;
    this.campaign = campaign;
    this.initiative = initiative;
    this.hp = hp;
    this.max_hp = max_hp;
    this.effects = effects;
    this.loot = loot;
    this.encounter = encounter;
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

  get max_hp() {
    return this._max_hp;
  }

  set max_hp(val) {
    this._max_hp = Number(val);
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
      max_hp: this.max_hp,
      effects: JSON.stringify(this.effects),
      campaign: this.campaign,
      loot: this.loot,
      encounter: this.encounter
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

class CombatantVuexModule extends CampaignDependentVuexModule {
  constructor() {
    super(Combatant);
  }
}

export default {
  Combatant,
  ...new CombatantVuexModule()
};
