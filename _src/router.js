import Vue from "vue";
import Router from "vue-router";
import Combat from "@/views/Combat";
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
        import(/* webpackChunkName: "combatants" */ "./views/CombatantList"),
      beforeEnter: loginRequired
    },
    {
      path: "/combatants/:uuid/",
      name: routeNames.COMBATANT,
      component: () =>
        import(/* webpackChunkName: "combatants" */ "./views/CombatantDetail"),
      beforeEnter: loginRequired
    },
    {
      path: "/combatants/new/",
      name: routeNames.COMBATANT_CREATE,
      component: () =>
        import(/* webpackChunkName: "combatants" */ "./views/CombatantCreate"),
      beforeEnter: loginRequired
    },
    {
      path: "/login/",
      name: routeNames.LOGIN,
      component: () =>
        import(/* webpackChunkName: "account" */ "./views/Login"),
      props: route => ({ loginRedirect: route.query.next }),
      beforeEnter: loggedInExcluded
    },
    {
      path: "/signup/",
      name: routeNames.SIGNUP,
      component: () =>
        import(/* webpackChunkName: "account" */ "./views/SignUp"),
      beforeEnter: loggedInExcluded
    },
    {
      path: "/404/",
      name: routeNames.NOT_FOUND,
      component: () => import(/* webpackChunkName: "404" */ "./views/NotFound")
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
