import Vue from 'vue'
import Router from 'vue-router'
import Combat from './views/Combat'
import passthrough from './views/_passthrough'

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Combat
    },
    {
      path: '/combatants/',
      component: passthrough,
      children: [
        {
          path: '',
          name: 'combatants',
          component: () => import(/* webpackChunkName: "combatants" */ './views/CombatantList'),
        },
        {
          path: ':uuid/',
          name: 'combatant',
          component: () => import(/* webpackChunkName: "combatants" */ './views/CombatantDetail')
        }
      ]
    }
  ]
})
