<template>
  <div class="page-container-full">
    <div class="page-body">
      <div class="content">
        <slot></slot>
      </div>
    </div>
    <el-backtop target=".page-container-full"></el-backtop>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { self } from '@/common'
export default defineComponent({
  name: 'HbPageLayoutFull',
  setup() {
    const hkf = self().$happykit
    const currentRouteMenu = hkf.getCurrentMenuRoute()
    return {
      currentRouteMenu
    }
  }
})
</script>
