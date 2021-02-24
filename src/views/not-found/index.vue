<template>
  <div class="not-found-page">
    <el-empty class="empty" image-size="300" description="您访问的页面好像不存在">
      <div>
        <el-link
          href="javascript:void(0)"
          @click="$router.push('/')"
        >
          回到首页
        </el-link>
      </div>
    </el-empty>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
})
</script>

<style lang="scss">
.not-found-page{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  .empty{
    justify-content: center;
    align-items: center;
    width: 100%;
  }
}


</style>
