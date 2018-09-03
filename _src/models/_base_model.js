import api from './_api'
import Vue from 'vue'
import _ from 'lodash'


function array2ObjByUUID (array) {
  return array.reduce((accumulator, currentVal) => {
    accumulator[currentVal.uuid] = currentVal;
    return accumulator
  }, {})
}

export class ApiVuexModel {
  constructor (modelName) {
    this.namespace = modelName;
    this.modelName = modelName;
    this.getterTypes = {
      IDS: this.modelName + 'IDs',
      LIST: this.modelName + 'List',
      BY_ID: this.modelName + 'ByID'
    };
    this.actionTypes = {
      CREATE: 'create',
      RETRIEVE: 'retrieve',
      UPDATE: 'update',
      DESTROY: 'destroy',
      LIST: 'list',
      REFRESH: 'refresh',
      REFRESH_LIST: 'refreshList',
      OPTIONS: 'options'
    };
    this.mutationTypes = {
      SET_LIST: 'setList',
      SET: 'set',
      REMOVE: 'remove',
      SET_OPTIONS: 'setOptions'
    };
    this.store = {
      namespaced: true,
      state: {
        [this.modelName]: {}
      },
      getters: {
        [this.getterTypes.IDS]: state => {
          return Object.keys(state[modelName])
        },
        [this.getterTypes.LIST]: (state, getters) => {
          return getters[this.getterTypes.IDS].map(
              ID => Object.assign(state[modelName][ID], { uuid: ID })
          )
        },
        [this.getterTypes.BY_ID]: state => uuid => state[modelName][uuid]
      },
      actions: {
        [this.actionTypes.LIST]: ({ state, commit, rootState }) => {
          if (typeof state[modelName] === 'undefined' || _.isEmpty(state[modelName])) {
            return api.listObjects({
              model: this.modelName,
              axiosConfig: { headers: { Authorization: rootState.Authorization } }
            }, objList => {
              commit(this.mutationTypes.SET_LIST, {
                objList: array2ObjByUUID(objList)
              })
            })
          } else {
            return Promise.resolve()
          }
        }
      },
      mutations: {
        [this.mutationTypes.SET_LIST]: (state, { objList }) => {
          Vue.set(state, this.modelName, objList)
        }
      }
    };
  }
}
