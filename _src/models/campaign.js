import { ModelVuexModule } from "./_base_model";

export class Campaign {
  static get modelName() {
    return "campaign";
  }

  constructor() {}
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
