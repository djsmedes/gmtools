import Vue from 'vue'
import Router from 'vue-router'
import Combat from './views/Combat'
import store from './store'
import auth from './auth'

Vue.use(Router);

export const routeNames = {
  HOME: 'home',
  COMBATANTS: 'combatants',
  COMBATANT: 'combatant',
  COMBATANT_CREATE: 'combatantCreate',
  LOGIN: 'login',
  SIGNUP: 'signup',
};

async function loginRequired (to, from, next) {
  if (!store.state[auth.stateKeys.USER].requested) {
    await store.dispatch(auth.actionTypes.GET_USER);
  }
  return store.state[auth.stateKeys.USER].isAuthenticated ? next() : next({
    name: routeNames.LOGIN,
    query: { next: to.path }
  })
}

async function loggedInExcluded (to, from, next) {
  if (!store.state[auth.stateKeys.USER].requested) {
    await store.dispatch(auth.actionTypes.GET_USER);
  }
  return store.state.user.isAuthenticated ? next({ name: routeNames.HOME }) : next()
}


export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: routeNames.HOME,
      component: Combat,
      beforeEnter: loginRequired
    },
    {
      path: '/combatants/',
      name: routeNames.COMBATANTS,
      component: () => import(/* webpackChunkName: "combatants" */ './views/CombatantList'),
      beforeEnter: loginRequired
    },
    {
      path: '/combatants/:uuid/',
      name: routeNames.COMBATANT,
      component: () => import(/* webpackChunkName: "combatants" */ './views/CombatantDetail'),
      beforeEnter: loginRequired
    },
    {
      path: '/combatants/new/',
      name: routeNames.COMBATANT_CREATE,
      component: () => import(/* webpackChunkName: "combatants" */ './views/CombatantCreate'),
      beforeEnter: loginRequired
    },
    {
      path: '/login/',
      name: routeNames.LOGIN,
      component: () => import(/* webpackChunkName: "account" */ './views/Login'),
      props: route => ({ loginRedirect: route.query.next }),
      beforeEnter: loggedInExcluded
    },
    {
      path: '/signup/',
      name: routeNames.SIGNUP,
      component: () => import(/* webpackChunkName: "account" */ './views/SignUp'),
      beforeEnter: loggedInExcluded
    }
  ]
})
