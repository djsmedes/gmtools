import { Model } from "./_baseModel";
import { CampaignDependentVuexModule } from "./_needsCampaignModule";

export class Combatant extends Model {
  static get modelName() {
    return "combatant";
  }

  constructor({
    uuid = null,
    campaign = "",
    name = "",
    initiative = 0,
    initiative_bonus = 0,
    hp = 0,
    max_hp = 0,
    temp_hp = 0,
    effects = {},
    loot = "",
    encounter = null,
  } = {}) {
    super();
    this.uuid = uuid;
    this.name = name;
    this.campaign = campaign;
    this.initiative = initiative;
    this.initiative_bonus = initiative_bonus;
    this.hp = hp;
    this.max_hp = max_hp;
    this.temp_hp = temp_hp;
    this.effects = effects;
    this.loot = loot;
    this.encounter = encounter;
  }

  get effects() {
    return this._effects;
  }

  set effects(val) {
    this._effects = val || {};
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

  static get effectTypes() {
    return {
      NONE: "",
      BUFF: "buffs",
      DEBUFF: "debuffs",
      OTHER: "others",
    };
  }
}

class CombatantVuexModule extends CampaignDependentVuexModule {
  constructor() {
    super();
    this.modelClass = Combatant;
  }
}

export default new CombatantVuexModule();
