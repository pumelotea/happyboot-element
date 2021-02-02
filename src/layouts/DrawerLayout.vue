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
  name: 'DrawerLayout',
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

<style>
.drawer-layout {
  outline: none !important;
}

.drawer-layout #el-drawer__title {
  margin: 0;
  padding: 20px;
  border-bottom: 1px solid rgba(94, 94, 94, 0.2);
  z-index: 1;
}

.x-drawer {
  position: absolute !important;
}

.x-drawer :focus {
  outline: none;
}

.x-drawer-out {
  position: fixed !important;
}

.x-drawer-out :focus {
  outline: none;
}
</style>

<style scoped>
.title-container {
  display: flex;
  align-items: center;
}

.title {
  font-size: 18px;
  flex: 1;
}
.drawer-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 0;
  top: 65px;
  padding: 20px;
}

.drawer-body {
  flex: 1;
  overflow: auto;
}

.drawer-foot {
  padding: 10px 20px;
  box-sizing: border-box;
  border-top: 1px solid rgba(94, 94, 94, 0.2);
  text-align: right;
}
.div-close{
  cursor: pointer;
  border-radius: 3px;
}
.div-close:hover{
  background-color: #eee;
}
</style>
