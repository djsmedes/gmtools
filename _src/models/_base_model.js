import api from './_api'
import Vue from 'vue'
import _ from 'lodash'
import debounce from 'debounce-promise'


function array2ObjByUUID (array, objConstructor) {
  return array.reduce((accumulator, currentVal) => {
    accumulator[currentVal.uuid] = new objConstructor(currentVal);
    return accumulator
  }, {})
}

export class ApiVuexModel {
  constructor (modelName, modelConstructor) {
    this.namespace = modelName;
    this.modelName = modelName;
    this.stateKeys = {
      OBJECTS: 'objects',
      NEEDS_RELOAD: 'needsReload'
    };
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
        [this.stateKeys.OBJECTS]: {},
        [this.stateKeys.NEEDS_RELOAD]: true
      },
      getters: {
        [this.getterTypes.IDS]: state => {
          return Object.keys(state[this.stateKeys.OBJECTS])
        },
        [this.getterTypes.LIST]: (state, getters) => {
          return getters[this.getterTypes.IDS].map(
              uuid => Object.assign(state[this.stateKeys.OBJECTS][uuid], { uuid: uuid })
          )
        },
        [this.getterTypes.BY_ID]: state => uuid => state[this.stateKeys.OBJECTS][uuid]
      },
      actions: {
        [this.actionTypes.LIST]: debounce(({ state, commit }) => {
          if (state[this.stateKeys.NEEDS_RELOAD] || typeof state[this.stateKeys.OBJECTS] === 'undefined' || _.isEmpty(state[this.stateKeys.OBJECTS])) {
            return api.listObjects({
              modelName: this.modelName
            }, objList => {
              commit(this.mutationTypes.SET_LIST, {
                objList: array2ObjByUUID(objList, modelConstructor)
              })
            })
          } else {
            return Promise.resolve()
          }
        }, 50),
        [this.actionTypes.CREATE]: ({ state, commit }, object) => {
          return api.createObject({
            object,
            modelName: this.modelName
          }, returnedObject => {
            commit(this.mutationTypes.SET, {
              object: new modelConstructor(returnedObject)
            })
          })
        },
        [this.actionTypes.UPDATE]: ({ commit }, object) => {
          return api.updateObject({
            object,
            modelName: this.modelName
          }, returnedObject => {
            commit(this.mutationTypes.SET, {
              object: new modelConstructor(returnedObject)
            })
          })
        }
      },
      mutations: {
        [this.mutationTypes.SET_LIST]: (state, { objList }) => {
          Vue.set(state, this.stateKeys.OBJECTS, objList);
          Vue.set(state, this.stateKeys.NEEDS_RELOAD, false);
        },
        [this.mutationTypes.SET]: (state, { object }) => {
          Vue.set(state[this.stateKeys.OBJECTS], object.uuid, object)
        }
      }
    };
  }
}
