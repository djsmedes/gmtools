export const namespace = 'auth';

export const stateKeys = {
  AUTHORIZATION: 'Authorization'
};

export const getterTypes = {};

export const actionTypes = {
  GET_USER: 'getUser',
  GET_TOKEN: 'getToken'
};

export const mutationTypes = {
  SET_USER: 'setUser',
  SET_AUTH: 'setAuth'
};

export const store = {
  namespaced: true,
  state: {
    [stateKeys.AUTHORIZATION]: ''
  },
  getters: {},
  actions: {
    [actionTypes.GET_TOKEN]: ({ commit }, { email, password }) => {

    }
  },
  mutations: {}

};

export default {
  namespace,
  stateKeys,
  getterTypes,
  actionTypes,
  mutationTypes,
  store
}


