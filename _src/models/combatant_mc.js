import { VuexModel } from "@/models/_vuexMCModel";
import { generateUrl } from "@/utils/urls";
import { MCModule } from "@/models/_baseMCModule";
import { mutateEmptyStringToNull } from "@/models/_baseMCModule";

const modelName = "combatant";

export class Combatant extends VuexModel {
  static get modelName() {
    return modelName;
  }

  options() {
    return {
      identifier: "uuid",
    };
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
    return Object.keys(this.defaults()).reduce((memo, key) => {
      return { ...memo, [key]: mutateEmptyStringToNull };
    }, {});
  }

  routes() {
    return {
      fetch: generateUrl([modelName, this.uuid]),
      delete: generateUrl([modelName, this.uuid]),
    };
  }

  getSaveURL() {
    return generateUrl([modelName, ...(this.uuid ? [this.uuid] : [])]);
  }

  getSaveMethod() {
    return this.uuid ? "PUT" : "POST";
  }
}

class CombatantModule extends MCModule {
  constructor() {
    super(modelName);
  }
}

export default new CombatantModule();
