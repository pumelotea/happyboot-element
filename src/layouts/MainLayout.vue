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
  </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'
import {defineComponent} from 'vue'
export default defineComponent({
  name: 'MainLayout',
  computed:{
    ...mapGetters(['isCollapse'])
  },
  setup(){

  }
})

</script>

<style scoped>
/*.main-layout {*/
/*  position: fixed;*/
/*  left: 0;*/
/*  right: 0;*/
/*  top: 0;*/
/*  bottom: 0;*/
/*  background: rgb(15, 18, 22);*/
/*}*/

/*.nav-bar {*/
/*  left: 220px;*/
/*  top: 55px;*/
/*  right: 0;*/
/*  height: 50px;*/
/*  position: absolute;*/
/*  !*background: white;*!*/
/*  padding-top: 4px;*/
/*}*/

/*.head-bar {*/
/*  left: 0;*/
/*  position: absolute;*/
/*  top: 0;*/
/*  right: 0;*/
/*  height: 60px;*/
/*  background: rgb(22,27,33);*/
/*}*/

/*.menu-list {*/
/*  position: absolute;*/
/*  top: 60px;*/
/*  left: 0;*/
/*  bottom: 0;*/
/*  width: 220px;*/
/*  background: rgb(15, 18, 22);*/
/*}*/

/*.content {*/
/*  position: absolute;*/
/*  left: 220px;*/
/*  right: 0;*/
/*  bottom: 0;*/
/*  top: 104px;*/
/*  margin: 5px;*/
/*  box-sizing: border-box;*/
/*}*/

/*.collapse-left {*/
/*  left: 64px;*/
/*  transition: all 0.2s ease-in-out;*/
/*}*/

/*.collapse-width-menu {*/
/*  width: 64px;*/
/*  transition: all 0.2s ease-in-out;*/
/*}*/

/*.uncollapse-left {*/
/*  left: 220px;*/
/*  transition: all 0.2s ease-in-out;*/
/*}*/

/*.uncollapse-width-menu {*/
/*  width: 220px;*/
/*  transition: all 0.2s ease-in-out;*/
/*}*/
</style>
