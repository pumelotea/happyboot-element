import {App} from 'vue'
import PageLayout from '@/layouts/PageLayout.vue'
import PageLayoutFull from '@/layouts/PageLayoutFull.vue'
import PageIframeLayout from '@/layouts/PageIframeLayout.vue'
import FormItemContainer from '@/layouts/FormItemContainer.vue'
import DrawerLayout from '@/layouts/DrawerLayout.vue'
import NoData from '@/components/NoData.vue'
import TextLogo from '@/components/TextLogo.vue'



export default {
  install(app: App){
    app.component('text-logo', TextLogo)
    app.component('page-layout', PageLayout)
    app.component('page-layout-full', PageLayoutFull)
    app.component('page-iframe-layout', PageIframeLayout)
    app.component('no-data', NoData)
    app.component('form-item-container', FormItemContainer)
    app.component('drawer-layout', DrawerLayout)
  }
}
