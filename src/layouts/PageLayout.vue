<template>
  <transition name="fade-transverse">
    <div class="page-container">
      <div class="page-body">
        <div class="title-container">
          <div class="breadcrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <template v-for="e in currentRouteMenu.value?.menuItem.breadcrumb">
                <el-breadcrumb-item
                  v-if="e.isRouter"
                  :to="{ path: e.routerPath }"
                  >{{ e.title }}
                </el-breadcrumb-item>
                <el-breadcrumb-item v-else>{{ e.title }}</el-breadcrumb-item>
              </template>
            </el-breadcrumb>
          </div>
        </div>
        <div class="alerts">
          <slot name="alerts"></slot>
        </div>
        <div class="actions">
          <slot name="actions"> </slot>
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
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getHappykitInstance } from '@/framework'
export default defineComponent({
  name: 'PageLayout',
  setup(){
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

.title-container {
  display: flex;
  align-items: center;
}

.title {
  font-size: 24px;
}

.breadcrumb {
  flex: 1;
}

.alerts {
  margin-top: 15px;
}

.actions {
  margin-top: 15px;
}

.content {
  margin-top: 15px;
}

.pagination {
  text-align: center;
  padding: 15px;
}
</style>
<style>
.el-backtop {
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.4) !important;
}
</style>
