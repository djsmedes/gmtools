import store from "@/store";
import auth from "@/auth";
import { routeNames } from "@/router";
import _ from "lodash";

const wasUserRequested = () =>
  store.getters[
    auth.namespace + "/" + auth.getterTypes.WAS_AUTH_USER_REQUESTED
  ];

const isUserAuthenticated = () =>
  store.getters[auth.namespace + "/" + auth.getterTypes.IS_USER_AUTHENTICATED];

export async function userRequired(to, from, next) {
  if (!wasUserRequested()) {
    await store.dispatch(auth.namespace + "/" + auth.actionTypes.GET_USER);
  }
  next();
}

export function loginRequired(to, from, next) {
  isUserAuthenticated()
    ? next()
    : next({
        name: routeNames.LOGIN,
        params: { successRoute: _.cloneDeep(to) }
      });
}

export function loggedInExcluded(to, from, next) {
  !isUserAuthenticated() ? next() : next({ name: routeNames.HOME });
}
