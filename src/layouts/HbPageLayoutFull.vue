<template>
  <div class="page-container-full">
    <div class="page-body">
      <div class="content">
        <slot></slot>
      </div>
    </div>
    <el-backtop :target="target"></el-backtop>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { self } from '@/common'
export default defineComponent({
  name: 'HbPageLayoutFull',
  setup() {
    const hkf = self().$happykit
    const currentRouteMenu = hkf.getCurrentMenuRoute()
    const target = computed(()=>{
      return `[pageid="${self().$happykit.getCurrentMenuRoute().value?.pageId}"] .page-body`
    })
    return {
      currentRouteMenu,
      target
    }
  }
})
</script>
