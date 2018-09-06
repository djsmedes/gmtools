import axios from 'axios'

function generateUrl (model, uuid = null) {
  const baseStr = '/api/' + model + '/';
  if (uuid) {
    return baseStr + uuid + '/'
  } else {
    return baseStr
  }
}

function consoleWarnError (error) {
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

export default {
  listObjects ({ model, axiosConfig={} }, resolve, reject = consoleWarnError) {
    return axios.get(
      generateUrl(model), axiosConfig
    ).then(r => {
      resolve(r.data)
    }).catch(e => {
      reject(e)
    })
  },
  createObject ({ object, model, axiosConfig={} }, resolve, reject = consoleWarnError) {
    return axios.post(
      generateUrl(model), object, axiosConfig
    ).then(r => {
      resolve(r.data)
    }).catch(e => {
      reject(e)
    })
  },
  retrieveObject ({ uuid, model, axiosConfig={} }, resolve, reject = consoleWarnError) {
    return axios.get(
      generateUrl(model, uuid), axiosConfig
    ).then(r => {
      resolve(r.data)
    }).catch(e => {
      reject(e)
    })
  },
  updateObject ({ object, model, axiosConfig={} }, resolve, reject = consoleWarnError) {
    return axios.put(
      generateUrl(model, object.uuid), object, axiosConfig
    ).then(r => {
      resolve(r.data)
    }).catch(e => {
      reject(e)
    })
  },
  destroyObject ({ uuid, model, axiosConfig={} }, resolve, reject = consoleWarnError) {
    return axios.delete(
      generateUrl(model, uuid), axiosConfig
    ).then(() => {
      resolve()
    }).catch(e => {
      reject(e)
    })
  },
  optionsObject ({ model, axiosConfig={} }, resolve, reject = consoleWarnError) {
    return axios.options(
      generateUrl(model), axiosConfig
    ).then(r => {
      resolve(r.data)
    }).catch(e => {
      reject(e)
    })
  }
}
