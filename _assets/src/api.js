import axios from 'axios'

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export default {
  get_user(context) {
    return axios.get(
        '/api/request-user/'
    ).then(r => {
      context.commit({
        type: 'set_user',
        user: r.data
      })
    }).catch(e => {
      console.log(e)
    })
  },
  get_object(context, { uuid, model }) {
    return axios.get(uuid + '/', {
      baseURL: '/api/' + String(model),
    }).then(r => {
      context.commit({
        type: 'set_object',
        model: model,
        object: r.data
      })
    }).catch(e => {
      console.log(e);
    })
  }
}