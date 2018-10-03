import store from "@/store";
import auth from "@/auth";
import { routeNames } from "@/router";

export async function userRequired(to, from, next) {
  if (
    !store.getters[
      auth.namespace + "/" + auth.getterTypes.WAS_AUTH_USER_REQUESTED
    ]
  ) {
    await store.dispatch(auth.namespace + "/" + auth.actionTypes.GET_USER);
  }
  next();
}

export function loginRequired(to, from, next) {
  if (
    store.getters[auth.namespace + "/" + auth.getterTypes.IS_USER_AUTHENTICATED]
  ) {
    next();
  } else {
    next({
      name: routeNames.LOGIN,
      query: { next: to.path }
    });
  }
}

export async function loggedInExcluded(to, from, next) {
  if (
    store.getters[auth.namespace + "/" + auth.getterTypes.IS_USER_AUTHENTICATED]
  ) {
    next({ name: routeNames.HOME });
  } else {
    next();
  }
}
