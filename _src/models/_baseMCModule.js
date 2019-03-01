import Vue from "vue";
import axios from "axios";
import { generateUrl } from "@/utils/urls";
import {
  stateKeys,
  getterTypes,
  actionTypes,
  mutationTypes,
} from "@/models/_constants";

export function array2ObjByUUID(array) {
  return array.reduce(
    (accumulator, currentVal) => ({
      ...accumulator,
      [currentVal.uuid]: currentVal,
    }),
    {}
  );
}

export class MCModule {
  get namespace() {
    return this.modelName;
  }

  constructor(modelName) {
    this.modelName = modelName;
    this.loading_list = false;

    this.getDetailUrl = (uuid, extra_url_pieces = []) =>
      generateUrl([this.modelName, uuid, ...extra_url_pieces]);
    this.getListUrl = (extra_url_pieces = []) =>
      generateUrl([this.modelName, ...extra_url_pieces]);

    this.stateKeys = stateKeys;
    this.getterTypes = getterTypes;
    this.actionTypes = actionTypes;
    this.mutationTypes = mutationTypes;
    this.store = {
      namespaced: true,
      state: {
        [this.stateKeys.OBJECTS]: {},
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
          return getters[this.getterTypes.OBJECTS][uuid];
        },
      },
      actions: {
        [this.actionTypes.LIST]: async ({ dispatch }) => {
          if (this.loading_list === false) {
            this.loading_list = true;
          } else {
            return;
          }

          try {
            return await dispatch(this.actionTypes.QUERY_LIST);
          } finally {
            this.loading_list = false;
          }
        },
        [this.actionTypes.QUERY_LIST]: async ({ commit }, params) => {
          let { data } = await axios.get(this.getListUrl(), { params });
          let objectDict = array2ObjByUUID(data);
          commit(this.mutationTypes.SET, {
            objectDict,
          });
          return objectDict;
        },
        SOCKET_DATA: async ({ commit }, wsEvent) => {
          let { data, replyTo } = wsEvent;
          commit(this.mutationTypes.SET, { objAry: data });
          commit("setLastReply", replyTo, { root: true });
        },
      },
      mutations: {
        [this.mutationTypes.SET]: (state, { object, objAry, objectDict }) => {
          if (object) {
            Vue.set(state[this.stateKeys.OBJECTS], object.uuid, object);
          } else if (objectDict) {
            Vue.set(state, this.stateKeys.OBJECTS, {
              ...state[this.stateKeys.OBJECTS],
              ...objectDict,
            });
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
