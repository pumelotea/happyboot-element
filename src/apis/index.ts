import axios from 'axios'
import axiosConfig from '@/apis/config'
import apiDefinition from '@/apis/definition'
import { App } from 'vue'
import {
  requestInterceptor,
  responseInterceptor,
  requestErrorHandler,
  responseErrorHandler
} from '@/apis/config'

//创建http请求客户端
export const httpClient = axios.create(axiosConfig)
httpClient.interceptors.request.use(requestInterceptor, requestErrorHandler)
httpClient.interceptors.response.use(responseInterceptor, responseErrorHandler)


export function $post(url: string, params?: any) {
  return new Promise((resolve, reject) => {
    httpClient
      .post(url, params)
      .then(
        res => {
          resolve(res.data)
        },
        err => {
          reject(err)
        }
      )
      .catch(err => {
        reject(err)
      })
  })
}

export function $get(url: string, params?: any) {
  return new Promise((resolve, reject) => {
    httpClient
      .get(url, {
        params: params
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export function $delete(url: string, params?: any) {
  return new Promise((resolve, reject) => {
    httpClient
      .delete(url, { params: params })
      .then(
        res => {
          resolve(res.data)
        },
        err => {
          reject(err)
        }
      )
      .catch(err => {
        reject(err)
      })
  })
}

export function $put(url: string, params?: any) {
  return new Promise((resolve, reject) => {
    httpClient
      .put(url, params)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export function $imgId2Url (id: string) {
  if (!id) {
    return 'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png'
  }
  // @ts-ignore
  return `${window.api[process.env.VUE_APP_BUILT_MODE].server}/sys/file/view/${id}`
}

export function $fileId2Url (id: string) {
  if (!id) {
    return 'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png'
  }
  // @ts-ignore
  return `${window.api[process.env.VUE_APP_BUILT_MODE].server}/sys/file/thumbnail/${id}`
}

const http = {
  // eslint-disable-next-line no-unused-vars
  install(app: App, options: any) {
    app.config.globalProperties.$http = httpClient
    app.config.globalProperties.$api = this
  },
  ...apiDefinition,
  $imgId2Url,
  $fileId2Url
}

export default http
