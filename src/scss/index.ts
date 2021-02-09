import store from '@/store'


// if (process.env.VUE_APP_BUILT_MODE === 'dev'){
//   require('@/scss/src/default.scss')
// }
// if (process.env.VUE_APP_BUILT_MODE === 'prod'){
  store.commit('initTheme')
// }
