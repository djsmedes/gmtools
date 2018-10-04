import api from "./_api";
import Vue from "vue";
import _ from "lodash";

function array2ObjByUUID(array, objConstructor) {
  return array.reduce((accumulator, currentVal) => {
    accumulator[currentVal.uuid] = new objConstructor(currentVal);
    return accumulator;
  }, {});
}

export class ModelVuexModule {
  constructor(modelClass) {
    this.namespace = modelClass.modelName;
    this.modelName = modelClass.modelName;
    this.stateKeys = {
      OBJECTS: "objects",
      NEEDS_RELOAD: "needsReload"
    };
    this.getterTypes = {
      IDS: "ids",
      LIST: "list",
      BY_ID: "byID"
    };
    this.actionTypes = {
      CREATE: "create",
      RETRIEVE: "retrieve",
      UPDATE: "update",
      DESTROY: "destroy",
      LIST: "list",
      REFRESH: "refresh",
      REFRESH_LIST: "refreshList",
      OPTIONS: "options"
    };
    this.mutationTypes = {
      SET_LIST: "setList",
      SET_RELOAD_NEEDED: "setReloadNeeded",
      SET: "set",
      REMOVE: "remove",
      SET_OPTIONS: "setOptions"
    };
    this.store = {
      namespaced: true,
      state: {
        [this.stateKeys.OBJECTS]: {},
        [this.stateKeys.NEEDS_RELOAD]: true
      },
      getters: {
        [this.getterTypes.IDS]: state => {
          return Object.keys(state[this.stateKeys.OBJECTS]);
        },
        [this.getterTypes.LIST]: (state, getters) => {
          return getters[this.getterTypes.IDS].map(uuid =>
            Object.assign(state[this.stateKeys.OBJECTS][uuid], { uuid: uuid })
          );
        },
        [this.getterTypes.BY_ID]: state => uuid =>
          state[this.stateKeys.OBJECTS][uuid]
      },
      actions: {
        [this.actionTypes.LIST]: async ({ state, commit }) => {
          if (state[this.stateKeys.NEEDS_RELOAD]) {
            // assume success until failure is apparent -
            //   further requests here before the first has completed
            //   get us nothing
            commit(this.mutationTypes.SET_RELOAD_NEEDED, false);
          } else {
            return;
          }

          if (
            typeof state[this.stateKeys.OBJECTS] === "undefined" ||
            _.isEmpty(state[this.stateKeys.OBJECTS])
          ) {
            try {
              let objList = await api.listObjects({
                modelName: this.modelName
              });
              commit(this.mutationTypes.SET_LIST, {
                objList: array2ObjByUUID(objList, modelClass)
              });
            } catch (err) {
              // ok, we have failed - allow further requests
              //   and escalate the failure
              commit(this.mutationTypes.SET_RELOAD_NEEDED, true);
              throw err;
            }
          }
        },
        [this.actionTypes.CREATE]: async ({ commit }, object) => {
          let returnedObject = await api.createObject({
            object,
            modelName: this.modelName
          });
          commit(this.mutationTypes.SET, {
            object: new modelClass(returnedObject)
          });
        },
        [this.actionTypes.UPDATE]: async ({ commit }, object) => {
          let returnedObject = await api.updateObject({
            object,
            modelName: this.modelName
          });
          commit(this.mutationTypes.SET, {
            object: new modelClass(returnedObject)
          });
        }
      },
      mutations: {
        [this.mutationTypes.SET_LIST]: (state, { objList }) => {
          Vue.set(state, this.stateKeys.OBJECTS, objList);
          Vue.set(state, this.stateKeys.NEEDS_RELOAD, false);
        },
        [this.mutationTypes.SET_RELOAD_NEEDED]: (state, val) => {
          Vue.set(state, this.stateKeys.NEEDS_RELOAD, val);
        },
        [this.mutationTypes.SET]: (state, { object }) => {
          Vue.set(state[this.stateKeys.OBJECTS], object.uuid, object);
        }
      }
    };
  }
}
