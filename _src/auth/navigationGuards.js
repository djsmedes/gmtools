import store from "@/store";
import { stateKeys } from "@/auth/vuexKeys";
import { authActions } from "@/auth";
import { routeNames } from "@/router";
import { getAuthUser } from "@/models";

export async function userRequired(to, from, next) {
  if (store.state.auth[stateKeys.AUTH_USER] === undefined) {
    await store.dispatch(authActions.GET_USER);
  }
  next();
}

export function loginRequired(to, from, next) {
  if (getAuthUser().isAuthenticated) {
    next();
  } else {
    next({
      name: routeNames.LOGIN,
      params: { successRoute: { ...to } },
    });
  }
}

export function loggedInExcluded(to, from, next) {
  if (getAuthUser().isAuthenticated) {
    next({ name: routeNames.HOME });
  } else {
    next();
  }
}
