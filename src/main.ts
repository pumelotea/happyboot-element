import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import http from '@/apis'
import {errorHandler,warnHandler} from '@/common/handlers.ts'
import eventBus from '@/common/eventBus'

import elementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import components from './components'
import 'animate.css'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-light.css' //样式文件

//导入框架实例
import happyFramework from '@/framework'


const app = createApp(App as any)
app.config.errorHandler = errorHandler
app.config.warnHandler = warnHandler
app.use(router)
app.use(http)
app.use(store)
app.use(eventBus)
app.use(elementPlus)
//作为插件安装
app.use(happyFramework)
//全局组件
app.use(components)

app.use(Viewer as any)
app.directive('highlight', function(el) {
  const blocks = el.querySelectorAll('pre')
  blocks.forEach((block:any) => {
    hljs.highlightBlock(block)
  })
  // blocks = el.querySelectorAll('code')
  // blocks.forEach((block) => {
  //   hljs.highlightBlock(block)
  // })
})


app.mount('#app')

