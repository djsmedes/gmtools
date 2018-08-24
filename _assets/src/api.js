import axios from 'axios'

export default {
  get_token(context, params) {
    return axios.post(
        'http://localhost:8000/api/token-auth/', {
          username: params.username,
          password: params.password
        }
    ).then(r => {
      axios.defaults.headers.common['Authorization'] = 'Token ' + r.data.token;
    }).catch(e => {
      console.log(e)
    })
  },
  get_user(context, params) {
    return axios.get(
        'http://localhost:8000/api/request-user/'
    ).then(r => {
      context.commit({
        type: 'set_user',
        object: r.data
      })
    }).catch(e => {
      console.log(e)
    })
  },
  get_object(context, params) {
    return axios.get(params.uuid + '/', {
      baseURL: '/api/' + String(params.model),
    }).then(r => {
      context.commit({
        type: 'set_object',
        model: params.model,
        object: r.data
      })
    }).catch(e => {
      console.log(e);
    })
  }
}