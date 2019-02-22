import Vue from "vue";
import Router from "vue-router";
import Combat from "@/components/encounters/Combat";
import {
  userRequired,
  loginRequired,
  loggedInExcluded,
} from "@/auth/navigationGuards";

Vue.use(Router);

export const routeNames = {
  HOME: "home",
  COMBATANTS: "combatants",
  COMBATANT: "combatant",
  COMBATANT_CREATE: "combatantCreate",
  CAMPAIGNS: "campaigns",
  CAMPAIGN: "campaign",
  CAMPAIGN_CREATE: "campaignCreate",
  ENCOUNTERS: "encounters",
  ENCOUNTER: "encounter",
  ENCOUNTER_CREATE: "encounterCreate",
  GMSCREENTAB: "gmScreenTab",
  GMSCREENTAB_CREATE: "gmScreenTabCreate",
  ACCOUNT_SETTINGS: "accountSettings",
  LOGIN: "login",
  SIGNUP: "signup",
  NOT_FOUND: "notFound",
};

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
    },

    {
      path: "/campaigns/",
      name: routeNames.CAMPAIGNS,
      component: () =>
        import(/* webpackChunkName: "campaigns" */ "@/components/accountManage/CampaignList"),
      beforeEnter: loginRequired,
    },
    {
      path: "/campaigns/new/",
      name: routeNames.CAMPAIGN_CREATE,
      component: () =>
        import(/* webpackChunkName: "campaigns" */ "@/components/accountManage/CampaignDetail"),
      beforeEnter: loginRequired,
    },
    {
      path: "/campaigns/:uuid/",
      name: routeNames.CAMPAIGN,
      component: () =>
        import(/* webpackChunkName: "campaigns" */ "@/components/accountManage/CampaignDetail"),
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
      path: "/gmscreentabs/new/",
      name: routeNames.GMSCREENTAB_CREATE,
      component: () =>
        import(/* webpackChunkName: "gmscreentabs" */ "@/components/gmscreen/GMScreenTabDetail"),
      beforeEnter: loginRequired,
    },
    {
      path: "/gmscreentabs/:uuid/",
      name: routeNames.GMSCREENTAB,
      component: () =>
        import(/* webpackChunkName: "gmscreentabs" */ "@/components/gmscreen/GMScreenTabDetail"),
      beforeEnter: loginRequired,
      props: true,
    },

    {
      path: "/login/",
      name: routeNames.LOGIN,
      component: () =>
        import(/* webpackChunkName: "nonAuth" */ "@/components/auth/Login"),
      props: true,
      beforeEnter: loggedInExcluded,
    },
    {
      path: "/signup/",
      name: routeNames.SIGNUP,
      component: () =>
        import(/* webpackChunkName: "nonAuth" */ "@/components/auth/SignUp"),
      beforeEnter: loggedInExcluded,
    },
    {
      path: "/account/",
      name: routeNames.ACCOUNT_SETTINGS,
      component: () =>
        import(/* webpackChunkName: "account" */ "@/components/auth/AccountOverview"),
      beforeEnter: loginRequired,
    },

    {
      path: "/404/",
      name: routeNames.NOT_FOUND,
      component: () =>
        import(/* webpackChunkName: "404" */ "@/components/generic/NotFound"),
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
