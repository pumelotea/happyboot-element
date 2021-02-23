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
        <hb-text-logo2/>
      </span>

    <img v-if="isCollapse" class="logo-svg" src="favicon_white.svg" />
  </div>
</template>

<script lang="ts">

import { mapGetters } from 'vuex'
import { defineComponent } from 'vue'
import HbTextLogo2 from '@/components/HbTextLogo2.vue'

export default defineComponent({
  name: 'HbHeadBarLogo',
  components: { HbTextLogo2 },
  computed: {
    ...mapGetters(['isCollapse'])
  }
})
</script>
