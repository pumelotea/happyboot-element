import {App} from 'vue'
import PageLayout from '@/layouts/PageLayout.vue'
import PageLayoutFull from '@/layouts/PageLayoutFull.vue'
import PageIframeLayout from '@/layouts/PageIframeLayout.vue'
import NoData from '@/components/NoData.vue'



export default {
  install(app: App){
    app.component('page-layout', PageLayout)
    app.component('page-layout-full', PageLayoutFull)
    app.component('page-iframe-layout', PageIframeLayout)
    app.component('no-data', NoData)
  }
}
