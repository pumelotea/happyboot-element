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
  name: 'PageLayoutFull',
  setup() {
    const hkf = self().$happykit
    const currentRouteMenu = hkf.getCurrentMenuRoute()
    return {
      currentRouteMenu
    }
  }
})
</script>

<style scoped>
/*.page-container-full {*/
/*  background: rgb(14,17,22);*/
/*  overflow: hidden;*/
/*  box-sizing: border-box;*/
/*  position: absolute;*/
/*  left: 0;*/
/*  top: 0;*/
/*  right: 0;*/
/*  bottom: 0;*/
/*  border: 1px solid rgb(49,54,60);*/
/*}*/

/*.page-body {*/
/*  overflow: auto;*/
/*  height: 100%;*/
/*  padding: 10px;*/
/*}*/

/*.content {*/
/*  position: relative;*/
/*  height: 100%;*/
/*}*/
</style>
