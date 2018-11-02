import { CampaignDependentVuexModule } from "@/models/_needsCampaignModule";

export class Encounter {
  static get modelName() {
    return "encounter";
  }

  constructor({
    uuid = null,
    name = "",
    campaign = "",
    completion_date = null
  } = {}) {
    this.uuid = uuid;
    this.name = name;
    this.campaign = campaign;
    this.completion_date = completion_date;
  }

  get completion_date() {
    return this._completion_date;
  }
  set completion_date(val) {
    this._completion_date = val === null ? null : new Date(val);
  }

  toJSON() {
    return {
      uuid: this.uuid,
      name: this.name,
      campaign: this.campaign,
      completion_date: this.completion_date
        ? this.completion_date.toISOString().split("T")[0]
        : this.completion_date
    };
  }
}

class EncounterVuexModule extends CampaignDependentVuexModule {
  constructor() {
    super(Encounter);
    this.getterTypes = {
      ...this.getterTypes,
      LIST_COMPLETED: "listCompleted"
    };
    this.store.getters = {
      ...this.store.getters,
      [this.getterTypes.LIST]: (state, getters) => {
        return Object.values(getters[this.getterTypes.OBJECTS]).filter(
          enc => enc.completion_date === null
        );
      },
      [this.getterTypes.LIST_COMPLETED]: (state, getters) => {
        return [
          ...Object.values(getters[this.getterTypes.OBJECTS]).filter(
            enc => enc.completion_date !== null
          )
        ].sort((a, b) => b.completion_date - a.completion_date);
      }
    };
  }
}

export default {
  Encounter,
  ...new EncounterVuexModule()
};
