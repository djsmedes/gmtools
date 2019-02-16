import { Model } from "./_baseModel";
import { CampaignDependentVuexModule } from "@/models/_needsCampaignModule";

export class Encounter extends Model {
  static get modelName() {
    return "encounter";
  }

  constructor({ uuid = null, name = "", campaign = "" } = {}) {
    super();
    this.uuid = uuid;
    this.name = name;
    this.campaign = campaign;
  }
}

class EncounterVuexModule extends CampaignDependentVuexModule {
  constructor() {
    super();
    this.modelClass = Encounter;
  }
}

export default new EncounterVuexModule();
