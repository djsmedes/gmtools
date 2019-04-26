import { Collection, Model } from "./_baseVueMcClasses";

const modelName = "campaign";

export class Campaign extends Model {
  static get modelName() {
    return modelName;
  }

  defaults() {
    return {
      uuid: null,
      name: "",
      gm_set: [],
      player_set: [],
      active_encounter: null,
    };
  }
}

export class CampaignList extends Collection {
  static get modelName() {
    return modelName;
  }

  options() {
    return {
      ...super.options(),
      model: Campaign,
    };
  }
}
