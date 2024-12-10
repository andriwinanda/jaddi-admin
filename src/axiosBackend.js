import axios from 'axios'
import store from './store/store'
import router from './router'
import swal from 'sweetalert';
import { ToastProgrammatic as Toast } from 'buefy'

import { getToken, getBaseUrl } from './localstorage-helper'
import { BASE_URL } from './key-helper';
// import dotenv from 'dotenv'

// dotenv.config()
// let myAxios = null
let myAxios = axios.create();
// let url = 'http://localhost:8088'
let url = 'https://pujon.vercel.app'
let token = getToken()
if (token) {
   myAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
if (url) {
  myAxios.defaults.baseURL = url
}

myAxios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  const originalRequest = error.config
  if (error) {
    if (!error.response || error.response.status === 500) {
      swal("Connection Lost!", "Please check your network connection!", "warning");
    }
    else if (error.response.status === 401 && originalRequest.url !== '/api/oauth/token') {
      store.dispatch("login/logout")
      router.push('/login')
    } else {
      Toast.open({
        message: error.response.data ? error.response.data.message : 'Error',
        type: "is-danger",
        position: "is-top"
      })
    }
  }
  return Promise.reject(error)
})

// myAxios.interceptors.request.use(function(config) {
//   const token = cookie.get(__TOKEN_KEY__);

//   if ( token != null ) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// }, function(err) {
//   return Promise.reject(err);
// });

export default myAxios