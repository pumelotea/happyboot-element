<template>
  <div class="page-container">
    <div class="page-body">
      <div class="content">
        <slot></slot>
      </div>
    </div>
    <el-backtop target=".page-container"></el-backtop>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getHappykitInstance } from '@/framework'

export default defineComponent({
  name: 'PageLayoutFull',
  setup() {
    const hkf = getHappykitInstance()
    const currentRouteMenu = hkf.getCurrentMenuRoute()
    return {
      currentRouteMenu
    }
  }
})
</script>

<style scoped>
.page-container {
  background: white;
  overflow: hidden;
  box-sizing: border-box;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

.page-body {
  overflow: auto;
  height: 100%;
  padding: 10px;
}

.content {
  position: relative;
  height: 100%;
}
</style>
<style>
.el-backtop {
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.4) !important;
}
</style>
