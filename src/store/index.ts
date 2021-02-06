import { createStore } from 'vuex'
import { loadCssFile, removeCssFile } from '@/common/utils'

const store = createStore({
  state: {
    isCollapse: false,
    /**
     * @打开个人中心时激活tab
     * 默认是打开个人信息
     * 备注：个人信息userInfo；修改密码editPassword；
     */
    userCenterActiveName: 'userInfo',
    activeTheme: 'light',
    themeNameMap: {
      light: {
        name: '日间模式',
        link: 'theme/light/default.css',
        icon: 'el-icon-moon',
        next: 'dark'
      },
      dark: {
        name: '夜间模式',
        link: 'theme/dark/default.css',
        icon: 'el-icon-sunny',
        next: 'light'
      }
    }
  },
  getters: {
    isCollapse(state) {
      return state.isCollapse
    },
    userCenterActiveName(state) {
      return state.userCenterActiveName
    },
    /**
     * @保存登录时账号的类型 userType
     * 备注：主账号:0; 子账号:1; 主账号在头像处有切换账号按钮；
     */
    userType() {
      return localStorage.getItem('userType') || '1'
    },
    activeTheme(state) {
      return state.activeTheme
    },
    themeNameMap(state) {
      return state.themeNameMap
    }
  },
  mutations: {
    toggleIsCollapse(state) {
      state.isCollapse = !state.isCollapse
    },
    /**
     * 设置个人中心的激活tab
     * @param state
     * @param payload
     */
    setUserCenterActiveName(state, payload) {
      state.userCenterActiveName = payload.activeName
    },
    /**
     * 设置登录时账号的类型 userType
     * 备注：主账号:0; 子账号:1; 主账号在头像处有切换账号按钮；
     * */
    setUserType(state, payload) {
      localStorage.setItem('userType', payload.userType)
    },
    setTheme(state, payload: string) {
      localStorage.setItem('activeTheme', payload)
      state.activeTheme = payload
      const domList = document.head.querySelectorAll(`link[data-id=happykit-theme]`)
      domList.forEach(dom => {
        const link = dom as HTMLLinkElement
        if (link.getAttribute('data-mode')===payload){
          link.rel = 'stylesheet'
        }else{
          link.rel = 'alternate stylesheet'
        }
      })
    },
    initTheme(state) {
      const theme = localStorage.getItem('activeTheme')
      state.activeTheme = theme || 'light'
      Object.keys(state.themeNameMap).forEach(key=>{
        const link = document.createElement('link')
        link.href = (state.themeNameMap as any)[key].link
        link.dataset.id = 'happykit-theme'
        link.dataset.mode = key
        link.rel = 'alternate stylesheet'
        if (state.activeTheme === key){
          link.rel = 'stylesheet'
        }
        document.head.append(link)
      })
    }
  }
})
export default store
