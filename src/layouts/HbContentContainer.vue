<template>
  <div style="overflow: auto;height: 100%">
    <slot></slot>
    <div class="content-placeholder animate__animated animate__fadeIn" v-if="navList.length === 0">
      <el-empty description="暂无页面" image-size="260"></el-empty>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { self } from '@/common'
export default defineComponent({
  name: 'HbContentContainer',
  setup() {
    const hkf = self().$happykit
    const navList = hkf.getNavList()
    return {
      navList
    }
  }
})


</script>

<style scoped>
.content-placeholder {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #b8b8b8;
}

.empty {
  width: 30%;
}
</style>
