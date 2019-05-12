import store from "@/store";
import auth from "@/auth";
import { routeNames } from "@/router";
import { authUser, User, CampaignList } from "@/models";

export async function userRequired(to, from, next) {
  if (store.state[auth.stateKeys.AUTH_USER] === undefined) {
    let { user, campaigns } = await store.dispatch(auth.actionTypes.GET_USER);
    if (user) new User(user).sync();
    if (campaigns) new CampaignList(campaigns).sync();
  }
  next();
}

export function loginRequired(to, from, next) {
  if (authUser().isAuthenticated) {
    next();
  } else {
    next({
      name: routeNames.LOGIN,
      params: { successRoute: { ...to } },
    });
  }
}

export function loggedInExcluded(to, from, next) {
  if (authUser().isAuthenticated) {
    next({ name: routeNames.HOME });
  } else {
    next();
  }
}
