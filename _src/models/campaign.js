import { ModelVuexModule } from "./_baseModule";

export class Campaign {
  static get modelName() {
    return "campaign";
  }

  constructor({ uuid = null, name = "", gm_set = [], player_set = [] } = {}) {
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
    this.getterTypes = {
      ...this.getterTypes,
      BY_USER: "byUser",
      BY_GM: "byGM",
      BY_PLAYER: "byPlayer"
    };
    this.store.getters = {
      ...this.store.getters,
      [this.getterTypes.BY_GM]: (state, getters) => userUuid => {
        return getters[this.getterTypes.LIST].filter(campaign => {
          return campaign.gm_set.includes(userUuid);
        });
      },
      [this.getterTypes.BY_PLAYER]: (state, getters) => userUuid => {
        return getters[this.getterTypes.LIST].filter(campaign => {
          return campaign.player_set.includes(userUuid);
        });
      },
      [this.getterTypes.BY_USER]: (state, getters) => userUuid => {
        return [
          ...getters[this.getterTypes.BY_GM](userUuid),
          ...getters[this.getterTypes.BY_PLAYER](userUuid)
        ];
      }
    };
  }
}

export default {
  Campaign,
  ...new CampaignVuexModule()
};
