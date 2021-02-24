import { AxiosRequestConfig } from 'axios'
import security from '@/security'
import happyFramework from '@/framework'
import store from '@/store'

const axiosConfig: AxiosRequestConfig = {
  // @ts-ignore
  baseURL: window.api[process.env.VUE_APP_BUILT_MODE].server,
  timeout: 30 * 1000
}

// eslint-disable-next-line no-unused-vars
export const requestInterceptor = (config: any) => {
  config.headers.Authorization = security.getToken()
  config.headers.ClientId = happyFramework.getTracker().clientId
  return config
}

// eslint-disable-next-line no-unused-vars
export const requestErrorHandler = (error: any) => {
  return Promise.reject(error)
}

// eslint-disable-next-line no-unused-vars
export const responseInterceptor = (response: any) => {
  if (response.status === 200) {
    if (response.data.code === 401) {
      store.commit('lock', true)
    }
  }
  return response
}

// eslint-disable-next-line no-unused-vars
export const responseErrorHandler = (error: any) => {
  return Promise.reject(error)
}


export default axiosConfig
