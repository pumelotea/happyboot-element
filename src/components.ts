import { App } from 'vue'
import HbPageLayout from '@/layouts/HbPageLayout.vue'
import HbPageLayoutFull from '@/layouts/HbPageLayoutFull.vue'
import HbPageIframeLayout from '@/layouts/HbPageIframeLayout.vue'
import HbFormItemContainer from '@/layouts/HbFormItemContainer.vue'
import HbDrawerLayout from '@/layouts/HbDrawerLayout.vue'
import HbNoData from '@/components/HbNoData.vue'
import HbTextLogo from '@/components/HbTextLogo.vue'
import HbImageUploader from '@/components/HbImageUploader.vue'
import HbRichTextEditor from '@/components/HbRichTextEditor.vue'


export default {
  install(app: App) {
    app.component('hb-text-logo', HbTextLogo)
    app.component('hb-page-layout', HbPageLayout)
    app.component('hb-page-layout-full', HbPageLayoutFull)
    app.component('hb-page-iframe-layout', HbPageIframeLayout)
    app.component('hb-no-data', HbNoData)
    app.component('hb-form-item-container', HbFormItemContainer)
    app.component('hb-drawer-layout', HbDrawerLayout)
    app.component('hb-image-uploader', HbImageUploader)
    app.component('hb-rich-text-editor', HbRichTextEditor)
  }
}
