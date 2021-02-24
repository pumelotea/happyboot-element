<template>
  <div class="page-container">
    <div class="page-body">
      <div class="title-container" v-if="setting.pageBreadSlot === 'enable'">
        <div class="breadcrumb">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <template v-for="e in currentRouteMenu?.menuItem.breadcrumb">
              <el-breadcrumb-item
                v-if="e.isRouter"
                :to="{ path: e.routerPath }"
              >{{ e.name }}
              </el-breadcrumb-item>
              <el-breadcrumb-item v-else>{{ e.name }}</el-breadcrumb-item>
            </template>
          </el-breadcrumb>
        </div>
      </div>
      <div class="alerts">
        <slot name="alerts"></slot>
      </div>
      <div class="actions">
        <slot name="actions"></slot>
      </div>

      <div class="content">
        <slot></slot>
      </div>
      <div class="pagination">
        <slot name="pagination"></slot>
      </div>
    </div>
    <el-backtop target=".page-container"></el-backtop>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { self } from '@/common'

export default defineComponent({
  name: 'HbPageLayout',
  setup() {
    const { $happykit,$store } = self()
    const currentRouteMenu = $happykit.getCurrentMenuRoute()
    const setting = computed(()=>{
      return $store.getters.layoutSetting
    })
    return {
      currentRouteMenu,
      setting
    }
  }
})
</script>
