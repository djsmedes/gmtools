import Vue from 'vue'
import Router from 'vue-router'
import Combat from './views/Combat'
import store from './store'

Vue.use(Router);

export const routeNames = {
  HOME: 'home',
  COMBATANTS: 'combatants',
  COMBATANT: 'combatant',
  COMBATANT_CREATE: 'combatantCreate',
  LOGIN: 'login',
  SIGNUP: 'signup',
};

function loginRequired (to, from, next) {
  return store.state.user.isAuthenticated ? next() : next({ name: routeNames.LOGIN, query: {next: to.path} })
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
      props: route => ({ loginRedirect: route.query.next })
    },
    {
      path: '/signup/',
      name: routeNames.SIGNUP,
      component: () => import(/* webpackChunkName: "account" */ './views/SignUp')
    }
  ]
})
