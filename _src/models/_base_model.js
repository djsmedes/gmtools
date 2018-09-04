import api from './_api'
import Vue from 'vue'
import _ from 'lodash'
import { getterTypes } from '../auth'
import debounce from 'debounce-promise'


function array2ObjByUUID (array, objConstructor = null) {
  return array.reduce((accumulator, currentVal) => {
    accumulator[currentVal.uuid] = objConstructor ? new objConstructor(currentVal) : currentVal;
    return accumulator
  }, {})
}

export class ApiVuexModel {
  constructor (modelName, modelConstructor = null) {
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
        [this.actionTypes.LIST]: debounce(({ state, commit, rootGetters }) => {
          if (typeof state[modelName] === 'undefined' || _.isEmpty(state[modelName])) {
            return api.listObjects({
              model: this.modelName,
              axiosConfig: { headers: { ...rootGetters[getterTypes.AUTH_HEADER] } }
            }, objList => {
              commit(this.mutationTypes.SET_LIST, {
                objList: array2ObjByUUID(objList, modelConstructor)
              })
            })
          } else {
            return Promise.resolve()
          }
        }, 100, { leading: true }),
        [this.actionTypes.CREATE]: ({ state, commit, rootGetters }, object) => {
          return api.createObject({
            object,
            model: this.modelName,
            axiosConfig: {}
          }, returnedObject => {
            commit(this.mutationTypes.SET, {
              object: returnedObject
            })
          })
        }
      },
      mutations: {
        [this.mutationTypes.SET_LIST]: (state, { objList }) => {
          Vue.set(state, this.modelName, objList)
        },
        [this.mutationTypes.SET]: (state, { object }) => {
          Vue.set(state[this.modelName], object.uuid, object)
        }
      }
    };
  }
}
