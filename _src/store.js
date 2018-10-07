import Vue from "vue";
import Vuex from "vuex";
import combatant from "@/models/combatant";
import user from "@/models/user";
import campaign from "@/models/campaign";
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
    [user.namespace]: user.store
  }
});
