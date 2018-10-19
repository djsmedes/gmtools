import Vue from "vue";
import Vuex from "vuex";
import campaign from "@/models/campaign";
import combatant from "@/models/combatant";
import encounter from "@/models/encounter";
import user from "@/models/user";
import auth from "@/auth";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  getters: {},
  actions: {},
  mutations: {},
  modules: {
    [auth.namespace]: auth.store,
    [campaign.namespace]: campaign.store,
    [combatant.namespace]: combatant.store,
    [encounter.namespace]: encounter.store,
    [user.namespace]: user.store
  }
});
