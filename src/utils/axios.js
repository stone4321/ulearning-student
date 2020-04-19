import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import { stringify } from 'qs'
import router from '@/router'
import store from '@/store'
import { getToken, getRefreshToken } from '@/utils/auth'

const baseApi = process.env.VUE_APP_BASE_API
const key = 'Bearer '
let showErrorMessage = true

// 自动转换data格式
const service = axios.create({
  baseURL: baseApi,
  timeout: 5000,
  transformRequest: [
    function dataStringify(data) {
      return stringify(data)
    }
  ]
})

// 不转化data格式
const service2 = axios.create({
  baseURL: baseApi,
  timeout: 5000
})

function showError(message) {
  if (showErrorMessage) {
    showErrorMessage = false
    Message({
      message: message,
      type: 'error'
    })
    this.setTimeout(() => {
      showErrorMessage = true
    }, 1000)
  }
}

// 拦截处理
function interceptor(service) {
  service.interceptors.request.use(
    config => {
      if (store.getters.token) {
      // 添加token
        config.headers['Authorization-token'] = key + getToken()
        config.headers['Authorization-refresh-token'] = key + getRefreshToken()
      }
      return config
    },
    error => {
      console.log(error)
      return Promise.reject(error)
    }
  )

  service.interceptors.response.use(
    response => {
      const res = response.data

      if (res.code !== 200) {
        showError(res.message)

        // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
        if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
          MessageBox.confirm(
            'You have been logged out, you can cancel to stay on this page, or log in again',
            'Confirm logout',
            {
              confirmButtonText: 'Re-Login',
              cancelButtonText: 'Cancel',
              type: 'warning'
            }
          ).then(() => {
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
          })
        }
        return Promise.reject(new Error(res.message || 'Error'))
      } else {
        return res
      }
    },
    error => {
      console.log(error) // for debug
      if (error.response && error.response.data) {
        const { code, message } = error.response.data
        // eslint-disable-next-line eqeqeq
        if (code == 400) {
          showError(message)
        // eslint-disable-next-line eqeqeq
        } else if (code == 401 || code == 403) {
          showError(message)
          // 1. 退出
          store.dispatch('user/logout').then(response => {
          // 2. 返回登录界面
            router.push('/login')
          })
        }
      }
      return Promise.reject(error)
    }
  )
}

interceptor(service)
interceptor(service2)

export default service
export const { get: axiosGet } = service
export const { post: axiosPost } = service
export const { delete: axiosDelete } = service

export const axios2 = service2
