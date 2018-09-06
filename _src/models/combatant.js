import { ApiVuexModel } from './_base_model';

const modelName = 'combatant';

export class Combatant {
  constructor ({
                 uuid = '',
                 name = '',
                 initiative = 0,
                 hp = 0,
                 effects = '{}',
               }={}) {
    this.uuid = uuid;
    this.name = name;
    this.initiative = initiative;
    this.hp = hp;
    this.effects = effects;
  }

  get initiative () { return this._initiative }
  set initiative (val) { this._initiative = Number(val) }

  get hp () { return this._hp }
  set hp (val) { this._hp = Number(val) }

  get effects () { return this._effects }
  set effects (val) {
    if (typeof val === 'string') {
      this._effects = JSON.parse(val)
    } else {
      this._effects = val
    }
    if (this._effects === null) this._effects = {};
    if (typeof this._effects.buffs === 'undefined') this._effects.buffs = [];
    if (typeof this._effects.debuffs === 'undefined') this._effects.debuffs = [];
    if (typeof this._effects.others === 'undefined') this._effects.others = [];
  }

  toJSON() {
    return {
      uuid: this.uuid,
      name: this.name,
      initiative: this.initiative,
      hp: this.hp,
      effects: JSON.stringify(this.effects)
    }
  }

}

export const effectTypes = {
  NONE: 0,
  BUFF: 1,
  DEBUFF: 2,
  OTHER: 3
};

class ApiVuexCombatant extends ApiVuexModel {
  constructor() {
    super(modelName, Combatant);
  }
}

export default {
  Combatant,
  effectTypes,
  ...(new ApiVuexCombatant())
}
