import api from "./_api";
import Vue from "vue";

function generateUrl(endpointList = []) {
  return ["", "api", ...endpointList, ""].join("/");
}

export function array2ObjByUUID(array, objConstructor) {
  return array.reduce((accumulator, currentVal) => {
    accumulator[currentVal.uuid] = new objConstructor(currentVal);
    return accumulator;
  }, {});
}

export class ModelVuexModule {
  constructor(modelClass = {}) {
    this.modelClass = modelClass;
    this.namespace = this.modelClass.modelName;
    this.modelName = this.modelClass.modelName;

    this.getDetailUrl = (uuid, extra_url_pieces = []) =>
      generateUrl([this.modelName, uuid, ...extra_url_pieces]);
    this.getListUrl = extra_url_pieces =>
      generateUrl([this.modelName, ...extra_url_pieces]);

    this.stateKeys = {
      OBJECTS: "objects",
      NEEDS_RELOAD: "needsReload",
    };
    this.getterTypes = {
      OBJECTS: "map",
      IDS: "ids",
      LIST: "list",
      BY_ID: "byID",
    };
    this.actionTypes = {
      CREATE: "create",
      RETRIEVE: "retrieve",
      UPDATE: "update",
      DESTROY: "destroy",
      LIST: "list",
      REFRESH: "refresh",
      REFRESH_LIST: "refreshList",
      OPTIONS: "options",
    };
    this.mutationTypes = {
      SET_LIST: "setList",
      SET_RELOAD_NEEDED: "setReloadNeeded",
      SET: "set",
      REMOVE: "remove",
      SET_OPTIONS: "setOptions",
    };
    this.store = {
      namespaced: true,
      state: {
        [this.stateKeys.OBJECTS]: {},
        [this.stateKeys.NEEDS_RELOAD]: true,
      },
      getters: {
        [this.getterTypes.OBJECTS]: state => {
          return state[this.stateKeys.OBJECTS];
        },
        [this.getterTypes.IDS]: (state, getters) => {
          return Object.keys(getters[this.getterTypes.OBJECTS]);
        },
        [this.getterTypes.LIST]: (state, getters) => {
          return Object.values(getters[this.getterTypes.OBJECTS]);
        },
        [this.getterTypes.BY_ID]: (state, getters) => uuid => {
          let obj = getters[this.getterTypes.OBJECTS][uuid];
          if (typeof obj === "undefined") return new this.modelClass();
          return obj;
        },
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

          try {
            let objList = await api.listObjects({
              modelName: this.modelName,
            });
            commit(this.mutationTypes.SET_LIST, {
              objList: array2ObjByUUID(objList, this.modelClass),
            });
          } catch (err) {
            // ok, we have failed - allow further requests
            //   and escalate the failure
            commit(this.mutationTypes.SET_RELOAD_NEEDED, true);
            throw err;
          }
        },
        [this.actionTypes.CREATE]: async ({ commit }, object) => {
          let returnedObject = await api.createObject({
            object,
            modelName: this.modelName,
          });
          returnedObject = new this.modelClass(returnedObject);
          commit(this.mutationTypes.SET, {
            object: returnedObject,
          });
          return returnedObject;
        },
        [this.actionTypes.REFRESH]: async ({ commit }, object) => {
          let returnedObject = await api.retrieveObject({
            uuid: object.uuid,
            modelName: this.modelName,
          });
          commit(this.mutationTypes.SET, {
            object: new this.modelClass(returnedObject),
          });
        },
        [this.actionTypes.UPDATE]: async ({ commit }, object) => {
          let returnedObject = await api.updateObject({
            object,
            modelName: this.modelName,
          });
          commit(this.mutationTypes.SET, {
            object: new this.modelClass(returnedObject),
          });
        },
        [this.actionTypes.DESTROY]: async ({ commit }, objectUuid) => {
          await api.destroyObject({
            uuid: objectUuid,
            modelName: this.modelName,
          });
          commit(this.mutationTypes.REMOVE, {
            objUuid: objectUuid,
          });
        },
      },
      mutations: {
        [this.mutationTypes.SET_LIST]: (state, { objList }) => {
          Vue.set(state, this.stateKeys.OBJECTS, objList);
          Vue.set(state, this.stateKeys.NEEDS_RELOAD, false);
        },
        [this.mutationTypes.SET_RELOAD_NEEDED]: (state, val) => {
          Vue.set(state, this.stateKeys.NEEDS_RELOAD, val);
        },
        [this.mutationTypes.SET]: (state, { object, objAry }) => {
          if (object) {
            Vue.set(state[this.stateKeys.OBJECTS], object.uuid, object);
          } else if (objAry) {
            objAry.map(obj =>
              Vue.set(
                state[this.stateKeys.OBJECTS],
                obj.uuid,
                new this.modelClass(obj)
              )
            );
          }
        },
        [this.mutationTypes.REMOVE]: (state, { objUuid }) => {
          Vue.delete(state[this.stateKeys.OBJECTS], objUuid);
        },
      },
    };
  }
}
