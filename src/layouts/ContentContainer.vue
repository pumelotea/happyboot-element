<template>
  <div style="overflow: auto;height: 100%">
    <slot></slot>
    <transition name="fade-scale">
      <div class="content-placeholder" v-if="navList.value.length === 0">
        <!--      这边可以定义未打开任何页面情况下的占位图或者文字      -->
        <img
          src="../../public/images/icon-403.svg"
          class="empty"
          draggable="false"
        />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getHappykitInstance } from '@/framework'
export default defineComponent({
  name: 'ContentContainer',
  setup(){
    const hkf = getHappykitInstance()
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
  width: 40%;
}
</style>
