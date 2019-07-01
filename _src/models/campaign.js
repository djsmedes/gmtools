import { Collection, Model } from "./_baseVueMcClasses";
import store from "@/store";
import { authGetters } from "@/auth";

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

/**
 * SYNCHRONOUS call to get the current campaign
 *
 * @return {Campaign}
 */
export function getCurrentCampaign() {
  let uuid = store.getters[authGetters.CURRENT_CAMPAIGN_UUID];
  let campaign = new Campaign({ uuid: uuid });
  campaign.reset();
  return campaign;
}
