<template>
  <el-drawer
    :class="outType ? 'x-drawer-out' : 'x-drawer'"
    custom-class="drawer-layout"
    :size="size"
    :visible.sync="isVisible"
    :modal="false"
    :direction="'rtl'"
    :show-close="false"
    @closed="closed"
    @opened="opened"
    :wrapperClosable="wrapperClosable"
  >
    <template #title>
      <div class="title-container">
        <!--        让焦点自动在该input-->
        <input style="position: fixed;left: -1000px;top: -1000px" />
        <div class="title">
          {{ title }}
        </div>
        <div>
          <el-link :underline="false" @click="closed">
            <i class="el-icon-close" style="font-size: 20px"></i>
          </el-link>
        </div>
      </div>
    </template>
    <div class="drawer-container" v-loading="loading">
      <div class="drawer-body">
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

<script>
export default {
  name: 'DrawerLayout',
  props: {
    outType: {
      type: Boolean,
      default: false
    },
    value: {
      type: Boolean
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
  watch: {
    value() {
      this.isVisible = this.value
      //
      this.$nextTick(() => {
        const dom = this.$el.querySelector('.drawer-body')
        if (dom) {
          dom.scrollTop = 0
        }
      })
    }
  },
  methods: {
    closed() {
      document.removeEventListener('keyup', this.handleEsc)
      this.isVisible = false
      this.$emit('input', false)
    },
    opened() {
      document.addEventListener('keyup', this.handleEsc)
    },
    handleEsc(e) {
      if (e.keyCode === 27) {
        this.closed()
      }
    },
    moveDom() {
      if (!this.moveToElId) {
        return
      }
      //滚动到顶部
      const dom = document.getElementById(this.moveToElId)
      if (dom) {
        dom.appendChild(this.$el)
      }
    }
  },
  data() {
    return {
      isVisible: false
    }
  },
  mounted() {
    this.isVisible = this.value
    this.moveDom()
  }
}
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
</style>
