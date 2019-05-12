export const stateKeys = {
  TOKEN: "authToken",
  AUTH_USER: "authUser",
  CURRENT_CAMPAIGN: "currentCampaign",
  PASS_RESET_USER_KEY: "passResetUserKey",
  PASS_RESET_TOKEN: "passResetToken",
};

export const getterTypes = {
  AUTH_HEADER: "authHeader",
  AUTH_USER_UUID: "authUserUuid",
  CURRENT_CAMPAIGN_UUID: "currentCampaignUuid",
};

export const actionTypes = {
  GET_USER: "getUser",
  SET_AUTH_USER: "setAuthUser",
  SIGNUP: "signUp",
  LOGIN: "getToken",
  LOGOUT: "removeToken",
};

export const mutationTypes = {
  SET_USER: "setUser",
  SET_AUTH_USER: "setAuthUser",
  CLEAR_AUTH_USER: "clearAuthUser",
  SET_CURRENT_CAMPAIGN: "setCurrentCampaign",
  SET_TOKEN: "setAuth",
  REMOVE_TOKEN: "removeAuth",
  SET_PASS_RESET_DATA: "setPassResetData",
  CLEAR_PASS_RESET_DATA: "clearPassResetData",
};
