import { ApiVuexModel } from './_base_model';

const modelName = 'combatant';

export class Combatant {
  constructor ({
                 uuid = '',
                 name = '',
                 initiative = 0,
                 hp = 0
               } = { uuid: '', name: '', initiative: 0, hp: 0 }) {
    this.uuid = uuid;
    this.name = name;
    this.initiative = initiative;
    this.hp = hp;
  }
}

class ApiVuexCombatant extends ApiVuexModel {
  constructor() {
    super(modelName, Combatant);
  }
}

export default {
  Combatant,
  ...(new ApiVuexCombatant())
}
