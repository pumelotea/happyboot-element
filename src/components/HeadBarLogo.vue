<template>
  <div
    class="head-bar-logo"
    :class="{
        'collapse-width-menu': isCollapse,
        'uncollapse-width-menu': !isCollapse,
        'brand-collapse': isCollapse
      }"
  >
      <span v-if="!isCollapse" :class="{ brand: !isCollapse }">
        <text-logo-2/>
      </span>

    <img v-if="isCollapse" class="logo-svg" src="favicon.svg" />
  </div>
</template>

<script lang="ts">

import { mapGetters } from 'vuex'
import { defineComponent } from 'vue'
import TextLogo2 from '@/components/TextLogo2.vue'

export default defineComponent({
  name: 'HeadBarLogo',
  components: { TextLogo2 },
  computed: {
    ...mapGetters(['isCollapse'])
  }
})
</script>

<style scoped>
/*.head-bar-logo {*/
/*  width: 220px;*/
/*  height: 100%;*/
/*  display: flex;*/
/*  align-content: center;*/
/*  align-items: center;*/
/*  text-align: center;*/
/*  justify-content: center;*/
/*  font-size: 30px;*/
/*  background: #00673b;*/
/*}*/

/*.logo-svg {*/
/*  width: 40px;*/
/*}*/

/*.brand {*/
/*  color: #00673b;*/
/*  font-weight: bold;*/
/*}*/

/*.brand-collapse {*/
/*  color: #00673b !important;*/
/*  font-weight: bold;*/
/*}*/
</style>
