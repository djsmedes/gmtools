export const stateKeys = {
  AUTH_USER: "authUser",
  CURRENT_CAMPAIGN: "currentCampaign",
  PASS_RESET_USER_KEY: "passResetUserKey",
  PASS_RESET_TOKEN: "passResetToken",
};

export const getterTypes = {
  AUTH_USER_UUID: "authUserUuid",
  CURRENT_CAMPAIGN_UUID: "currentCampaignUuid",
  AUTH_USER: "authUser",
  CURRENT_CAMPAIGN: "currentCampaign",
};

export const actionTypes = {
  GET_USER: "getUser",
  SIGNUP: "signUp",
  LOGIN: "getToken",
  LOGOUT: "removeToken",
};

export const mutationTypes = {
  SET_AUTH_USER: "setAuthUser",
  CLEAR_AUTH_USER: "clearAuthUser",
  SET_CURRENT_CAMPAIGN: "setCurrentCampaign",
  REMOVE_TOKEN: "removeAuth",
};
