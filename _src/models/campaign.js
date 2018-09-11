import { ApiVuexModel } from './_base_model';

const modelName = 'campaign';

export class Campaign {
  constructor () {

  }
}

class ApiVuexCombatant extends ApiVuexModel {
  constructor () {
    super(modelName, Campaign);
  }
}

export default {
  Combatant,
  ...(new ApiVuexCombatant())
}
