import store from "@/store";
import auth from "@/auth";
import { routeNames } from "@/router";

const wasUserRequested = () =>
  store.getters[
    auth.namespace + "/" + auth.getterTypes.WAS_AUTH_USER_REQUESTED
  ];

const isUserAuthenticated = () =>
  store.getters[auth.namespace + "/" + auth.getterTypes.IS_USER_AUTHENTICATED];

export async function userRequired(to, from, next) {
  wasUserRequested()
    ? next()
    : await store.dispatch(auth.namespace + "/" + auth.actionTypes.GET_USER);
}

export function loginRequired(to, from, next) {
  isUserAuthenticated()
    ? next()
    : next({ name: routeNames.LOGIN, query: { next: to.path } });
}

export function loggedInExcluded(to, from, next) {
  !isUserAuthenticated() ? next() : next({ name: routeNames.HOME });
}
