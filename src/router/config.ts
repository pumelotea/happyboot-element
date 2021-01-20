import { RouteRecordRaw } from 'vue-router'
import { createDefaultRouterInterceptor,RouterInterceptorType } from 'happykit'
import apis from '@/apis'
//导入框架实例
import happyFramework from '@/framework'
// @ts-ignore
import routerData from './routerData'
import security from '@/security'

//创建默认的拦截器
const beforeInterceptor = createDefaultRouterInterceptor({
  interceptorType:RouterInterceptorType.BEFORE,
  framework:happyFramework,
  async dataLoader(){
    //准备请求接口获取菜单
    let req: any = { code: 0, msg: '' }
    let loading = null
    const properties: any = happyFramework.options.app?.config.globalProperties
    try {
      loading = properties.$loading({
        lock: true,
        text: 'Loading',
        background: 'rgba(255, 255, 255, 1)'
      })
      req = await apis.getAuthMenuTree()
      loading.close()
    } catch (e) {
      loading && loading.close()
      properties.$alert(e.message, '路由加载失败')
      return false
    }

    if (req.code === 401) {
      properties
        .$confirm(req.msg, '请尝试重新登录', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        .then(() => {
          //清空过期或者损坏的token
          security.refreshToken('')

        })
        .catch((e: any) => {
          console.log(e)
        })
      return false
    }

    if (req.code !== 0) {
      properties.$alert(req.msg, '路由加载失败')
      return false
    }

    return req.data
  },
  dataLoadFailureHandler(){
    console.log('数据加载失败')
  },
  routerInjectOption:{
    parentRoute: {
      name: 'home',
      path: '/',
      component: () => import('@/views/home/index.vue')
    },
    routes: [],
    viewLoader(view){
      return ()=>import(`@/views${view}`)
    }
  }
})
const afterInterceptor = createDefaultRouterInterceptor({
  interceptorType:RouterInterceptorType.AFTER,
  framework:happyFramework
})

const routes: Array<RouteRecordRaw> = [
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/login/index.vue')
  },
  {
    name: 'switch-user',
    path: '/switch-user',
    component: () => import('@/views/switch-user/index.vue')
  }
]

export const beforeEachHandler = (to: any, from: any, next: any) => {
  //使用拦截器
  beforeInterceptor.filter(to,from,next)
}

// eslint-disable-next-line no-unused-vars
export const afterEachHandler = (to: any, from: any) => {
  //使用拦截器
  // afterInterceptor.filter(to,from)
}


export default routes
