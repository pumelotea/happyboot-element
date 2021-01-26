import { createStore } from 'vuex'

const store = createStore({
  state: {
    isCollapse:false,
    /**
     * @打开个人中心时激活tab
     * 默认是打开个人信息
     * 备注：个人信息userInfo；修改密码editPassword；
     */
    userCenterActiveName: 'userInfo',
    /**
     * @保存登录时账号的类型 userType
     * 备注：主账号:0; 子账号:1; 主账号在头像处有切换账号按钮；
     */
    userType: '1'
  },
  getters:{
    isCollapse(state){
      return state.isCollapse
    },
    userCenterActiveName(state) {
      return state.userCenterActiveName
    },
    userType(state) {
      return state.userType
    }
  },
  mutations:{
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
      state.userType = payload.userType
    }
  }
})
export default store
