import axios from 'axios'

export default {
  get_user(context, params) {
    return axios.get(
        'http://localhost:8000/api/request-user/'
    ).then(r => {
      console.log(r.data);
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