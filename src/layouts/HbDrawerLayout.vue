<template>
  <el-drawer
    ref="ED"
    :class="outType ? 'x-drawer-out' : 'x-drawer'"
    custom-class="drawer-layout"
    :size="size"
    v-model="isVisible"
    :modal="false"
    :direction="'rtl'"
    :show-close="false"
    :closed="closed"
    :wrapperClosable="wrapperClosable"
  >
    <template #title>
      <div class="title-container">
        <!--        让焦点自动在该input   vue3版本elementui已经没有这个骚操作了-->
<!--        <input style="position: fixed;left: -1000px;top: -1000px" />-->
        <div class="title">
          {{ title }}
        </div>
        <div>
          <div @click="closed" class='div-close'>
            <i class="el-icon-close" style="font-size: 20px"></i>
          </div>
        </div>
      </div>
    </template>
    <div class="drawer-container" v-loading="loading">
      <div class="drawer-body" ref='drawerBody'>
        <slot></slot>
      </div>
      <div class="drawer-foot" v-if="!noFoot">
        <slot name="actions"></slot>
      </div>
    </div>
    <div>
      <slot name="next"></slot>
    </div>
  </el-drawer>
</template>

<script lang='ts'>
import { defineComponent, onMounted, ref, watch, nextTick, toRefs } from 'vue'
import { self } from '@/common'

export default defineComponent({
  name: 'HbDrawerLayout',
  props: {
    outType: {
      type: Boolean,
      default: false
    },
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '标题'
    },
    size: {
      type: String,
      default: '600px'
    },
    wrapperClosable: {
      type: Boolean,
      default: false
    },
    //移动dom到目标id下
    moveToElId: {
      type: String,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    noFoot: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const context = self()

    const ED = ref(null)

    const { value, moveToElId } = toRefs(props)

    const drawerBody = ref<HTMLDivElement | null>(null)

    watch(value, () => {
      isVisible.value = value.value
      nextTick(() => {
        drawerBody.value!.scrollTop = 0
      })
    })

    const isVisible = ref(false)

    const closed = () => {
      (ED.value as any).handleClose()
      isVisible.value = false
      emit('input', false)
    }


    const moveDom = () => {
      if (!moveToElId.value) {
        return
      }
      //滚动到顶部
      const dom = document.getElementById(moveToElId.value)
      if (dom) {
        dom.appendChild(context.$el)
      }
    }

    onMounted(() => {
      isVisible.value = value.value
      moveDom()
    })

    return {
      closed,
      isVisible,
      ED
    }
  }
})
</script>
