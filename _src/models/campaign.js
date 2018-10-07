import { ModelVuexModule } from "./_base_model";

export class Campaign {
  static get modelName() {
    return "campaign";
  }

  constructor({ uuid = "", name = "", gm_set = [], player_set = [] } = {}) {
    this.uuid = uuid;
    this.name = name;
    this.gm_set = gm_set;
    this.player_set = player_set;
  }

  toJSON() {
    return {
      uuid: this.uuid,
      name: this.name
    };
  }
}

class CampaignVuexModule extends ModelVuexModule {
  constructor() {
    super(Campaign);
  }
}

export default {
  Campaign,
  ...new CampaignVuexModule()
};
