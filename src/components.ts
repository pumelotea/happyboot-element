import {App} from 'vue'
import PageLayout from '@/layouts/PageLayout.vue'
import PageLayoutFull from '@/layouts/PageLayoutFull.vue'
import PageIframeLayout from '@/layouts/PageIframeLayout.vue'
import FormItemContainer from '@/layouts/FormItemContainer.vue'
import DrawerLayout from '@/layouts/DrawerLayout.vue'
import NoData from '@/components/NoData.vue'



export default {
  install(app: App){
    app.component('page-layout', PageLayout as any)
    app.component('page-layout-full', PageLayoutFull as any)
    app.component('page-iframe-layout', PageIframeLayout as any)
    app.component('no-data', NoData as any)
    app.component('form-item-container', FormItemContainer as any)
    app.component('drawer-layout', DrawerLayout as any)
  }
}
