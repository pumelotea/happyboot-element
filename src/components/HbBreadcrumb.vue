<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <template v-for="e in currentRouteMenu?.menuItem.breadcrumb">
      <el-breadcrumb-item
        v-if="e.isRouter"
        :to="{ path: e.routerPath }"
      >
        <i :class="e.icon" v-if="setting.breadIcon === 'enable'"></i>
        {{ e.name }}
      </el-breadcrumb-item>
      <el-breadcrumb-item v-else>
        <i :class="e.icon" v-if="setting.breadIcon === 'enable'"></i>
        {{ e.name }}
      </el-breadcrumb-item>
    </template>
  </el-breadcrumb>
</template>

<script lang="ts">
import { self } from '@/common'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'HbBreadcrumb',
  setup() {
    const { $happykit, $store } = self()
    const currentRouteMenu = $happykit.getCurrentMenuRoute()
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

<style scoped>

</style>
