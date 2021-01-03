import { createStore } from 'vuex'

const store = createStore({
  state: {
    isCollapse:false
  },
  getters:{
    isCollapse(state){
      return state.isCollapse
    }
  },
  mutations:{
    toggleIsCollapse(state) {
      state.isCollapse = !state.isCollapse
    },
  }
})
export default store
