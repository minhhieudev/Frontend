import axios from 'axios'
import route from './../routes'
import store from './../store'
import { getToken, setToken } from '@/utils/auth'
import Vue from 'vue'
let vue = new Vue()
const service = axios.create({
  timeout: 15000, // 15s
  headers: {
    accept: 'application/json'
  }
})
service.interceptors.request.use(
  config => {
    config.headers['x-access-token'] = getToken()
    config.baseURL = process.env.VUE_APP_BACKEND_URL + process.env.VUE_APP_API_PATH || 'http://localhost:8000/api/v1/private'
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

const beforeResponse = (response) => {
  if ('data' in response) {
    if ('message' in response.data) {
      vue.$notify({
        type: response.data.status,
        message: typeof response.data.message == 'object' ? response.data.message.message : response.data.message,
        dangerouslyUseHTMLString: response.data.dangerouslyUseHTMLString,
        showClose: true,
        duration: 7000,
      })
    }
    if ('renew_token' in response.data) {
      setToken(response.data.wr_renew_token)
    }
  }
}

service.interceptors.response.use(response => {
  beforeResponse(response)
  return Promise.resolve(response)
}, err => {
  store.dispatch('toggleLoading', 'reset')
  if (err.response) {
    beforeResponse(err.response)
    // for not permission access
    if (err.response.status === 403) {
      route.push({path: '/'})
    }
    // if 401 || 400 status code then redirect to login route
    if (err.response.status === 401) {
      store.dispatch('tokenNotValid').then(() => {
        route.push({path: '/login'}).catch(()=>{})
      })
      return Promise.reject(err.response)
    }
  } else {
    vue.$notify({
      type: 'error',
      message: 'Can\'t connect to server. Please try again later.',
      showClose: true,
      duration: 7000,
    })
  }
  return Promise.reject(err.response)
})

export default service
