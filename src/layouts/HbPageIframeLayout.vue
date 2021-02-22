<template>
  <div class="page-iframe-container">
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
import { self } from '@/common'
export default defineComponent({
  name: 'HbPageIframeLayout',
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
    return {
      currentRouteMenu
    }
  }
})

</script>
