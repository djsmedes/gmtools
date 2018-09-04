import Vue from 'vue'
import Router from 'vue-router'
import Combat from './views/Combat'

Vue.use(Router);

export const routeNames = {
  HOME: 'home',
  COMBATANTS: 'combatants',
  COMBATANT: 'combatant',
  COMBATANT_CREATE: 'combatantCreate',
  LOGIN: 'login'
};

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: routeNames.HOME,
      component: Combat
    },
    {
      path: '/combatants/',
      name: routeNames.COMBATANTS,
      component: () => import(/* webpackChunkName: "combatants" */ './views/CombatantList')
    },
    {
      path: '/combatants/:uuid/',
      name: routeNames.COMBATANT,
      component: () => import(/* webpackChunkName: "combatants" */ './views/CombatantDetail')
    },
    {
      path: '/combatants/new/',
      name: routeNames.COMBATANT_CREATE,
      component: () => import(/* webpackChunkName: "combatants" */ './views/CombatantCreate')
    },
    {
      path: '/login/',
      name: routeNames.LOGIN,
      component: () => import(/* webpackChunkName: "account" */ './views/Login')
    }
  ]
})
