import store from "@/store";
import auth from "@/auth";
import { routeNames } from "@/router";
import { getAuthUser } from "@/models";

export async function userRequired(to, from, next) {
  if (store.state[auth.stateKeys.AUTH_USER] === undefined) {
    await store.dispatch(auth.actionTypes.GET_USER);
  }
  next();
}

export async function loginRequired(to, from, next) {
  if ((await getAuthUser()).isAuthenticated) {
    next();
  } else {
    next({
      name: routeNames.LOGIN,
      params: { successRoute: { ...to } },
    });
  }
}

export async function loggedInExcluded(to, from, next) {
  if ((await getAuthUser()).isAuthenticated) {
    next({ name: routeNames.HOME });
  } else {
    next();
  }
}
