<template>
  <div class="page-container">
    <div class="page-body">
      <div class="title-container" v-if="setting.pageBreadSlot === 'enable'">
        <div class="breadcrumb">
          <hb-breadcrumb/>
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
    <el-backtop target=".page-body"></el-backtop>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { self } from '@/common'
import HbBreadcrumb from '@/components/HbBreadcrumb.vue'

export default defineComponent({
  name: 'HbPageLayout',
  components: { HbBreadcrumb },
  setup() {
    const { $store } = self()
    const setting = computed(()=>{
      return $store.getters.layoutSetting
    })
    return {
      setting
    }
  }
})
</script>
