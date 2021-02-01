<template>
  <div
    class="logo"
    :class="{
        'collapse-width-menu': isCollapse,
        'uncollapse-width-menu': !isCollapse,
        'brand-collapse': isCollapse
      }"
  >
      <span v-if="!isCollapse" :class="{ brand: !isCollapse }">
        happy
      </span>
    <img v-if="isCollapse" class="logo-svg" src="favicon.svg" />
    <span v-if="!isCollapse">boot</span>
  </div>
</template>

<script lang="ts">

import { mapGetters } from 'vuex'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HeadBarLogo',
  computed: {
    ...mapGetters(['isCollapse'])
  }
})
</script>

<style scoped>
.logo {
  width: 220px;
  height: 100%;
  display: flex;
  align-content: center;
  align-items: center;
  text-align: center;
  justify-content: center;
  font-size: 30px;
}

.logo-svg {
  width: 40px;
}

.brand {
  color: #ffd419;
  font-weight: bold;
}

.brand-collapse {
  color: #ffd419 !important;
  font-weight: bold;
}
</style>
