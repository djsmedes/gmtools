import axios from 'axios'
import Vue from 'vue'

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

function generateUrl (model, uuid = null) {
  const baseStr = '/api/' + model + '/';
  if (uuid) {
    return baseStr + uuid + '/';
  } else {
    return baseStr;
  }
}

function array2ObjByUUID (array) {
  return array.reduce((accumulator, currentVal) => {
    accumulator[currentVal.uuid] = currentVal;
    return accumulator
  }, {})
}

export const models = {
  USER: 'user',
  COMBATANT: 'combatant'
};

export const actionTypes = {
  LIST_OBJECTS: 'list_objects',
  GET_USER: 'get_user',
  GET_TOKEN: 'get_token'
};

export const mutationTypes = {
  SET_OBJECT_LIST: 'set_object_list',
  SET_USER: 'set_user',
  SET_AUTH: 'set_auth'
};

export default {
  models: models,
  state: {
    [models.USER]: {},
    [models.COMBATANT]: {},
    Authorization: ''
  },
  actionTypes: actionTypes,
  actions: {
    [actionTypes.GET_TOKEN] ({ commit }, { username, password }) {
      return axios.post(
          '/api/token-auth/', {
            username: username,
            password: password
          }
      ).then(r => {
        commit(mutationTypes.SET_AUTH, { auth_string: 'Token ' + r.data.token })
      }).catch(e => {
        console.log(e)
      })
    },
    [actionTypes.GET_USER] ({ state, commit }) {
      return axios.get(
          '/api/request-user/', { headers: { Authorization: state.Authorization } }
      ).then(r => {
        commit({
          type: mutationTypes.SET_USER,
          user: r.data
        })
      }).catch(e => {
        console.log(e)
      })
    },
    [actionTypes.LIST_OBJECTS] ({ commit, state }, { model }) {
      return axios.get(
          generateUrl(model), { headers: { Authorization: state.Authorization } }
      ).then(r => {
        commit({
          type: mutationTypes.SET_OBJECT_LIST,
          model: model,
          object_list: array2ObjByUUID(r.data)
        })
      }).catch(e => {
        console.log(e);
      })
    }
  },
  mutationTypes: mutationTypes,
  mutations: {
    [mutationTypes.SET_OBJECT_LIST] (state, { object_list, model }) {
      Vue.set(state, model, object_list)
    },
    [mutationTypes.SET_USER] (state, { user }) {
      Vue.set(state, 'user', user)
    },
    [mutationTypes.SET_AUTH] (state, { auth_string }) {
      Vue.set(state, 'Authorization', auth_string)
    }
  }
}
