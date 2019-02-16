import { ModelVuexModule } from "./_baseModule";
import auth from "@/auth";

export class CampaignDependentVuexModule extends ModelVuexModule {
  constructor() {
    super();
    this.store.getters = {
      ...this.store.getters,
      [this.getterTypes.OBJECTS]: (state, getters, rootState, rootGetters) => {
        let authUserGetterKey =
          auth.namespace + "/" + auth.getterTypes.AUTH_USER;
        let user = rootGetters[authUserGetterKey];
        if (!user) return {};
        let campaignUuid = user.current_campaign;
        if (!campaignUuid) return {};
        return Object.values(state[this.stateKeys.OBJECTS]).reduce(
          (acc, curObj) => {
            if (curObj.campaign === campaignUuid) {
              acc[curObj.uuid] = curObj;
            }
            return acc;
          },
          {}
        );
      },
    };
  }
}
