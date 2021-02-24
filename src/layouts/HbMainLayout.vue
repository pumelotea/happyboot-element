<template>
  <div class="main-layout">
    <div class="head-bar-slot">
      <slot name="head-bar">

      </slot>
    </div>
    <div
      class="nav-bar-slot"
      :class="{ 'collapse-left': isCollapse, 'uncollapse-left': !isCollapse }"
    >
      <slot name="nav-bar">
      </slot>
    </div>
    <div
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
      :class="{ 'collapse-left': isCollapse, 'uncollapse-left': !isCollapse }"
    >
      <slot name="content"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'
import {defineComponent} from 'vue'
export default defineComponent({
  name: 'HbMainLayout',
  computed:{
    ...mapGetters(['isCollapse'])
  },
  setup(){

  }
})

</script>
