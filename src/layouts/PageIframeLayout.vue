<template>
  <div class="page-container">
    <div class="page-body">
      <div class="title" v-if="!noTitle">{{ currentRouteMenu?.title }}</div>
      <div class="breadcrumb" v-if="breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <template v-for="e in currentRouteMenu?.menuItem.breadcrumb">
            <el-breadcrumb-item
              v-if="e.isRouter"
              :to="{ path: e.routerPath }"
            >{{ e.title }}
            </el-breadcrumb-item>
            <el-breadcrumb-item v-else>{{ e.title }}</el-breadcrumb-item>
          </template>
        </el-breadcrumb>
      </div>
      <div class="content">
        <iframe class="main-iframe" frameborder="0" :src="url"></iframe>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getHappykitInstance } from '@/framework'

export default defineComponent({
  name: 'PageIframeLayout',
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
  display: flex;
  flex-direction: column;
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

.title {
  font-size: 24px;
}

.breadcrumb {
  margin-top: 15px;
}

.alerts {
  margin-top: 15px;
}

.actions {
  margin-top: 15px;
}

.content {
  /*margin-top: 15px;*/
  flex: 1;
  height: 100%;
}

.main-iframe {
  width: 100%;
  height: 100%;
}
</style>
