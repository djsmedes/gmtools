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
    this.effects = typeof effects === 'string' ? JSON.parse(effects) : effects;
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
