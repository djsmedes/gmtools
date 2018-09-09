import axios from 'axios'

export function generateUrl (modelName, uuid = null) {
  const baseStr = '/api/' + modelName + '/';
  return uuid ? baseStr + uuid + '/' : baseStr
}

function consoleWarnError (error) {
  if (!error.response) {
    console.warn(error);
    return
  }

  let errString = String(error.response.status) + ' ' + String(error.response.statusText)

  if (error.response.data) {
    errString += ': ';
    Object.entries(error.response.data).reduce((a, cur) => {
      errString += cur[0];
      for (let err of cur[1]) {
        errString += ', ' + err
      }
      errString += '; '
    }, {})
  }

  console.warn(errString)
}

export function listObjects ({ modelName, axiosConfig={} }, resolve, reject = consoleWarnError) {
    return axios.get(
      generateUrl(modelName), axiosConfig
    ).then(r => {
      resolve(r.data)
    }).catch(e => {
      reject(e)
    })
  }

export function createObject ({ object, modelName, axiosConfig={} }, resolve, reject = consoleWarnError) {
    return axios.post(
      generateUrl(modelName), object, axiosConfig
    ).then(r => {
      resolve(r.data)
    }).catch(e => {
      reject(e)
    })
  }

export function retrieveObject ({ uuid, modelName, axiosConfig={} }, resolve, reject = consoleWarnError) {
    return axios.get(
      generateUrl(modelName, uuid), axiosConfig
    ).then(r => {
      resolve(r.data)
    }).catch(e => {
      reject(e)
    })
  }

export function updateObject ({ object, modelName, axiosConfig={} }, resolve, reject = consoleWarnError) {
    return axios.put(
      generateUrl(modelName, object.uuid), object, axiosConfig
    ).then(r => {
      resolve(r.data)
    }).catch(e => {
      reject(e)
    })
  }

export function destroyObject ({ uuid, modelName, axiosConfig={} }, resolve, reject = consoleWarnError) {
    return axios.delete(
      generateUrl(modelName, uuid), axiosConfig
    ).then(() => {
      resolve()
    }).catch(e => {
      reject(e)
    })
  }

export function optionsObject ({ modelName, axiosConfig={} }, resolve, reject = consoleWarnError) {
    return axios.options(
      generateUrl(modelName), axiosConfig
    ).then(r => {
      resolve(r.data)
    }).catch(e => {
      reject(e)
    })
}

export default {
  listObjects,
  createObject,
  retrieveObject,
  updateObject,
  destroyObject,
  optionsObject
}
