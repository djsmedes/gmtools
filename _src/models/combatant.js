import { Collection } from "vue-mc/vue-mc.es";
import { VuexModel } from "@/models/_vuexMCModel";
import { generateUrl2 as generateUrl } from "@/utils/urls";
import { MCModule } from "@/models/_baseMCModule";
import { mutateEmptyStringToNull } from "@/models/_baseMCModule";
import store from "@/store";
import toPairs from "lodash/toPairs";
import fromPairs from "lodash/fromPairs";

const modelName = "combatant";

export class Combatant extends VuexModel {
  options() {
    return {
      identifier: "uuid",
      store,
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
    return Object.keys(this.defaults()).reduce(
      (memo, key) => ({
        ...memo,
        [key]: [...(memo[key] || []), mutateEmptyStringToNull],
      }),
      {
        buffs: [v => v || []],
        debuffs: [v => v || []],
        others: [v => v || []],
      }
    );
  }

  routes() {
    return {
      fetch: generateUrl(modelName, this.uuid),
      delete: generateUrl(modelName, this.uuid),
    };
  }

  getSaveURL() {
    return this.uuid
      ? generateUrl(modelName, this.uuid)
      : generateUrl(modelName);
  }

  getSaveMethod() {
    return this.uuid ? "PUT" : "POST";
  }
}

export class CombatantList extends Collection {
  options() {
    return {
      model: Combatant,
      store,
    };
  }

  routes() {
    return {
      fetch: generateUrl(modelName),
    };
  }

  getFetchQuery() {
    let pairs = toPairs(this.getOption("storeFilter"));
    return fromPairs(pairs.map(pair => [pair[0], pair[1] || ""]));
  }
}

class CombatantModule extends MCModule {
  constructor() {
    super(modelName);
  }
}

export default new CombatantModule();
