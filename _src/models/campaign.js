import { Collection, Model } from "./_baseVueMcClasses";
import store from "@/store";
import { stateKeys } from "@/auth/vuexKeys";

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
 * async call to get the current campaign and store it
 *   must be called before most of the application will work
 *
 * @return {Promise<Campaign>}
 */
export async function getCurrentCampaign() {
  let uuid = store.state[stateKeys.CURRENT_CAMPAIGN];
  let campaign = new Campaign({ uuid: uuid });
  if (uuid) await campaign.fetch();
  return campaign;
}

/**
 * SYNCHRONOUS call to get the current campaign
 *   will not work until getCurrentCampaign has been called once, but that should happen
 *   when the app boots - prefer THIS function most of the time
 *
 * @return {Campaign}
 */
export function currentCampaign() {
  let uuid = store.state[stateKeys.CURRENT_CAMPAIGN];
  let campaign = new Campaign({ uuid: uuid });
  campaign.reset();
  return campaign;
}
