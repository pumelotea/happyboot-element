import { RouteRecordRaw } from 'vue-router'
import { createDefaultRouterInterceptor, DataLoadResult, RouterInterceptorType } from 'happykit'
import apis from '@/apis'
//导入框架实例
import happyFramework from '@/framework'
import security from '@/security'

//创建默认的拦截器
const beforeInterceptor = createDefaultRouterInterceptor({
  interceptorType:RouterInterceptorType.BEFORE,
  framework:happyFramework,
  async dataLoader(to, from, next) {
    const $loading = happyFramework.options.app?.config.globalProperties.$loading
    const $alert = happyFramework.options.app?.config.globalProperties.$alert
    const $confirm = happyFramework.options.app?.config.globalProperties.$confirm
    const result:DataLoadResult = {
      rawData:null,
      message:'',
    }
    let req:any = { code: 0, msg: '' }
    let loading = null
    try {
      loading = $loading({
        lock: true,
        text: 'Loading',
      })
      req = await apis.getAuthMenuTree()
      loading.close()
    } catch (e) {
      loading && loading.close()
      $alert(e.message, '路由加载失败')
      result.message = e.message
      return result
    }

    if (req.code === 401) {
     $confirm(req.msg, '请尝试重新登录', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        .then(() => {
          //清空过期或者损坏的token
          security.refreshToken('')
          next!('/login')
        })
        .catch((e:any) => {
          console.log(e)
        })
      return result
    }

    if (req.code !== 0) {
      $alert(req.msg, '路由加载失败')
      return result
    }
    result.rawData = req.data
    return result
  },
  dataLoadFailureHandler(result, to, from, next){
    console.log(result)
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
  if (!security.getToken()){
    if (to.path !== '/login') {
      next('/login')
      return
    }
    next()
    return
  }
  //使用拦截器
  beforeInterceptor.filter(to,from,next)
}

// eslint-disable-next-line no-unused-vars
export const afterEachHandler = (to: any, from: any) => {
  //使用拦截器
  // afterInterceptor.filter(to,from)
}


export default routes
