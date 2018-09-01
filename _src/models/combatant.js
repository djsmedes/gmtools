import { ApiVuexModel } from './_base_model';

const modelName = 'combatant';

export function Combatant({ uuid='', name='', initiative=0, hp=0 }={uuid: '', name: '', initiative: 0, hp: 0}) {
  this.uuid = uuid;
  this.name = name;
  this.initiative = initiative;
  this.hp = hp;
}

Combatant.prototype = {
  constructor: Combatant,
};

export default {
  Combatant,
  ...(new ApiVuexModel(modelName))
}
