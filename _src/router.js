import Vue from "vue";
import Router from "vue-router";
import Combat from "@/components/combat/Combat";
import {
  userRequired,
  loginRequired,
  loggedInExcluded
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
  ACCOUNT_SETTINGS: "accountSettings",
  LOGIN: "login",
  SIGNUP: "signup",
  NOT_FOUND: "notFound"
};

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: routeNames.HOME,
      component: Combat,
      beforeEnter: loginRequired
    },

    {
      path: "/combatants/",
      name: routeNames.COMBATANTS,
      component: () =>
        import(/* webpackChunkName: "combatants" */ "@/components/combat/CombatantList"),
      beforeEnter: loginRequired
    },
    {
      path: "/combatants/new/",
      name: routeNames.COMBATANT_CREATE,
      component: () =>
        import(/* webpackChunkName: "combatants" */ "@/components/combat/CombatantCreate"),
      beforeEnter: loginRequired
    },
    {
      path: "/combatants/:uuid/",
      name: routeNames.COMBATANT,
      component: () =>
        import(/* webpackChunkName: "combatants" */ "@/components/combat/CombatantDetail"),
      beforeEnter: loginRequired
    },

    {
      path: "/campaigns/",
      name: routeNames.CAMPAIGNS,
      component: () =>
        import(/* webpackChunkName: "campaigns" */ "@/components/accountManage/CampaignList"),
      beforeEnter: loginRequired
    },
    {
      path: "/campaigns/new/",
      name: routeNames.CAMPAIGN_CREATE,
      component: () =>
        import(/* webpackChunkName: "campaigns" */ "@/components/accountManage/CampaignCreate"),
      beforeEnter: loginRequired
    },
    {
      path: "/campaigns/:uuid/",
      name: routeNames.CAMPAIGN,
      component: () =>
        import(/* webpackChunkName: "campaigns" */ "@/components/accountManage/CampaignDetail"),
      beforeEnter: loginRequired
    },

    {
      path: "/login/",
      name: routeNames.LOGIN,
      component: () =>
        import(/* webpackChunkName: "nonAuth" */ "@/components/auth/Login"),
      props: true,
      beforeEnter: loggedInExcluded
    },
    {
      path: "/signup/",
      name: routeNames.SIGNUP,
      component: () =>
        import(/* webpackChunkName: "nonAuth" */ "@/components/auth/SignUp"),
      beforeEnter: loggedInExcluded
    },
    {
      path: "/account/",
      name: routeNames.ACCOUNT_SETTINGS,
      component: () =>
        import(/* webpackChunkName: "account" */ "@/components/auth/AccountSettings"),
      beforeEnter: loginRequired
    },

    {
      path: "/404/",
      name: routeNames.NOT_FOUND,
      component: () =>
        import(/* webpackChunkName: "404" */ "@/components/generic/NotFound")
    },
    {
      /* THIS SHOULD ALWAYS BE AT THE END
       * it will match any route not already matched and send it to the 404 page
       */
      path: "*",
      redirect: { name: routeNames.NOT_FOUND }
    }
  ]
});

router.beforeEach(userRequired);

export default router;
