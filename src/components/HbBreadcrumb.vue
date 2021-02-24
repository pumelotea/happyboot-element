<template>
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
</template>

<script lang="ts">
import { self } from '@/common'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HbBreadcrumb',
  setup() {
    const { $happykit } = self()
    const currentRouteMenu = $happykit.getCurrentMenuRoute()
    return {
      currentRouteMenu
    }
  }
})
</script>

<style scoped>

</style>
