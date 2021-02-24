<template>
  <div class="main-layout">
    <div class="head-bar-slot">
      <slot name="head-bar"></slot>
    </div>
    <div
      v-if="setting.navSlot === 'nav'"
      class="nav-bar-slot"
      :class="{ 'collapse-left': isCollapse, 'uncollapse-left': !isCollapse,'menu-list-slot-disable': setting.leftSlot === 'disable',}"
    >
      <slot name="nav-bar"></slot>
    </div>
    <div
      v-if="setting.leftSlot === 'menu'"
      class="menu-list-slot"
      :class="{
        'collapse-width-menu': isCollapse,
        'uncollapse-width-menu': !isCollapse
      }"
    >
      <slot name="menu-list"></slot>
    </div>
    <div
      class="content-slot"
      :class="{ 'collapse-left': isCollapse,
      'uncollapse-left': !isCollapse ,
      'nav-bar-slot-disable': setting.navSlot === 'disable',
      'menu-list-slot-disable': setting.leftSlot === 'disable',
    }"
    >
      <slot name="content"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'
import { computed, defineComponent } from 'vue'
import { self } from '@/common'

export default defineComponent({
  name: 'HbMainLayout',
  computed: {
    ...mapGetters(['isCollapse'])
  },
  setup() {
    const { $store } = self()
    const setting = computed(() => {
      return $store.getters.layoutSetting
    })
    return {
      setting
    }
  }
})

</script>
