import { CampaignDependentVuexModule } from "@/models/_needsCampaignModule";

export class Encounter {
  static get modelName() {
    return "encounter";
  }

  constructor({ uuid = null, name = "", campaign = "" } = {}) {
    this.uuid = uuid;
    this.name = name;
    this.campaign = campaign;
  }
}

class EncounterVuexModule extends CampaignDependentVuexModule {
  constructor() {
    super(Encounter);
  }
}

export default {
  Encounter,
  ...new EncounterVuexModule()
};
