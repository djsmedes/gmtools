import Vue from "vue";
import Router from "vue-router";
import Combat from "@/views/CombatView";
import {
  userRequired,
  loginRequired,
  loggedInExcluded,
} from "@/auth/navigationGuards";

Vue.use(Router);

export const routeNames = {
  HOME: "home",
  CAMPAIGNS: "campaigns",

  COMBATANTS: "combatants",
  COMBATANT: "combatant",
  COMBATANT_CREATE: "combatantCreate",

  ENCOUNTERS: "encounters",
  ENCOUNTER: "encounter",
  ENCOUNTER_CREATE: "encounterCreate",

  STATBLOCKS: "statblocks",
  STATBLOCK: "statblock",
  STATBLOCK_CREATE: "statblockCreate",

  CREATUREPROPS: "creatureprops",
  CREATUREPROP: "creatureprop",
  CREATUREPROP_CREATE: "creaturepropCreate",

  GMSCREENTAB: "gmScreenTab",
  GMSCREENTAB_CREATE: "gmScreenTabCreate",

  ACCOUNT_SETTINGS: "accountSettings",
  LOGIN: "login",
  SIGNUP: "signup",
  NOT_FOUND: "notFound",
};
Vue.prototype.$routeNames = routeNames;

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: routeNames.HOME,
      component: Combat,
      beforeEnter: loginRequired,
    },

    {
      path: "/combatants/",
      name: routeNames.COMBATANTS,
      component: () =>
        import(/* webpackChunkName: "combatants" */ "@/components/encounters/CombatantList"),
      beforeEnter: loginRequired,
    },
    {
      path: "/combatants/new/",
      name: routeNames.COMBATANT_CREATE,
      component: () =>
        import(/* webpackChunkName: "combatants" */ "@/components/encounters/CombatantDetail"),
      beforeEnter: loginRequired,
    },
    {
      path: "/combatants/:uuid/",
      name: routeNames.COMBATANT,
      component: () =>
        import(/* webpackChunkName: "combatants" */ "@/components/encounters/CombatantDetail"),
      beforeEnter: loginRequired,
      props: true,
    },

    {
      path: "/campaigns/",
      name: routeNames.CAMPAIGNS,
      component: () =>
        import(/* webpackChunkName: "campaigns" */ "@/components/accountManage/CampaignList"),
      beforeEnter: loginRequired,
    },

    {
      path: "/encounters/",
      name: routeNames.ENCOUNTERS,
      component: () =>
        import(/* webpackChunkName: "encounters" */ "@/components/encounters/EncounterList"),
      beforeEnter: loginRequired,
    },
    {
      path: "/encounters/new/",
      name: routeNames.ENCOUNTER_CREATE,
      component: () =>
        import(/* webpackChunkName: "encounters" */ "@/components/encounters/EncounterDetail"),
      beforeEnter: loginRequired,
    },
    {
      path: "/encounters/:uuid/",
      name: routeNames.ENCOUNTER,
      component: () =>
        import(/* webpackChunkName: "encounters" */ "@/components/encounters/EncounterDetail"),
      beforeEnter: loginRequired,
      props: true,
    },

    {
      path: "/statblocks/",
      name: routeNames.STATBLOCKS,
      component: () =>
        import(/* webpackChunkName: "statblocks" */ "@/components/statblocks/StatblockList"),
      beforeEnter: loginRequired,
    },
    {
      path: "/statblocks/new/",
      name: routeNames.STATBLOCK_CREATE,
      component: () =>
        import(/* webpackChunkName: "statblocks" */ "@/components/statblocks/StatblockDetail"),
      beforeEnter: loginRequired,
    },
    {
      path: "/statblocks/:uuid/",
      name: routeNames.STATBLOCK,
      component: () =>
        import(/* webpackChunkName: "statblocks" */ "@/components/statblocks/StatblockDetail"),
      beforeEnter: loginRequired,
      props: true,
    },
    {
      path: "/creatureprops/",
      name: routeNames.CREATUREPROPS,
      component: () =>
        import(/* webpackChunkName: "statblocks" */ "@/components/statblocks/CreaturePropList"),
      beforeEnter: loginRequired,
    },
    // {
    //   path: "/creatureprops/new/",
    //   name: routeNames.CREATUREPROP_CREATE,
    //   component: () =>
    //     import(/* webpackChunkName: "statblocks" */ "@/components/statblocks/CreaturePropDetail"),
    //   beforeEnter: loginRequired,
    // },
    {
      path: "/creatureprops/:uuid/",
      name: routeNames.CREATUREPROP,
      component: () =>
        import(/* webpackChunkName: "statblocks" */ "@/components/statblocks/CreaturePropDetail"),
      beforeEnter: loginRequired,
      props: true,
    },

    {
      path: "/gmscreentabs/new/",
      name: routeNames.GMSCREENTAB_CREATE,
      component: () =>
        import(/* webpackChunkName: "misc" */ "@/components/gmscreen/GMScreenTabDetail"),
      beforeEnter: loginRequired,
    },
    {
      path: "/gmscreentabs/:uuid/",
      name: routeNames.GMSCREENTAB,
      component: () =>
        import(/* webpackChunkName: "misc" */ "@/components/gmscreen/GMScreenTabDetail"),
      beforeEnter: loginRequired,
      props: true,
    },

    {
      path: "/login/",
      name: routeNames.LOGIN,
      component: () =>
        import(/* webpackChunkName: "misc" */ "@/views/AuthLogin"),
      props: true,
      beforeEnter: loggedInExcluded,
    },
    {
      path: "/signup/",
      name: routeNames.SIGNUP,
      component: () =>
        import(/* webpackChunkName: "misc" */ "@/views/AuthSignUp"),
      beforeEnter: loggedInExcluded,
    },
    {
      path: "/account/",
      name: routeNames.ACCOUNT_SETTINGS,
      component: () =>
        import(/* webpackChunkName: "misc" */ "@/components/auth/AccountOverview"),
      beforeEnter: loginRequired,
    },

    {
      path: "/404/",
      name: routeNames.NOT_FOUND,
      component: () =>
        import(/* webpackChunkName: "misc" */ "@/components/generic/NotFound"),
    },

    {
      /* THIS SHOULD ALWAYS BE AT THE END
       * it will match any route not already matched and send it to the 404 page
       */
      path: "*",
      redirect: { name: routeNames.NOT_FOUND },
    },
  ],
});

router.beforeEach(userRequired);

export default router;
