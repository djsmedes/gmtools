import axios from 'axios'

export function getToken ({ email, password }, resolve, axiosConfig = {}) {
  return axios.post(
      '/api/token-auth/', {
        username: email,
        password: password
      }, axiosConfig
  ).then(r => {
    resolve(r.data.token)
  }).catch(e => {
    if (String(e.response.status) === '400') {
      return Promise.reject(e.response.data)
    } else {
      return e;
    }
  })
}

export function getUser (resolve, axiosConfig = {}) {
  return axios.get(
      '/api/request-user/', axiosConfig
  ).then(r => {
    resolve(r.data)
  })
}

export function signUp ({email, password1, password2}, resolve, axiosConfig = {}) {
  return axios.post(
      '/api/signup/', {
        email,
        password1,
        password2
      }, axiosConfig
  ).then(r => {
    resolve({user: r.data.user, token: r.data.token})
  })
}

export default {
  getToken,
  getUser,
  signUp
}
