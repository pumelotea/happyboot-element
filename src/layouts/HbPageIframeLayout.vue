<template>
  <div class="page-iframe-container">
    <div class="page-body">
      <div class="title" v-if="!noTitle">{{ currentRouteMenu?.title }}</div>
      <div class="breadcrumb" v-if="breadcrumb && setting.pageBreadSlot === 'enable'">
        <hb-breadcrumb/>
      </div>
      <div class="content">
        <iframe class="main-iframe" frameborder="0" :src="url"></iframe>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { self } from '@/common'
import HbBreadcrumb from '@/components/HbBreadcrumb.vue'
export default defineComponent({
  name: 'HbPageIframeLayout',
  components: { HbBreadcrumb },
  props: {
    url: {
      type: String
    },
    noTitle: {
      type: Boolean,
      default: true
    },
    breadcrumb: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const hkf = self().$happykit
    const currentRouteMenu = hkf.getCurrentMenuRoute()
    const { $store } = self()
    const setting = computed(() => {
      return $store.getters.layoutSetting
    })
    return {
      currentRouteMenu,
      setting
    }
  }
})

</script>
