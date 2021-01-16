<template>
  <page-iframe-layout :url="url"></page-iframe-layout>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import router from '@/router'
export default defineComponent({
  name: 'index',
  setup(){
    const url = computed(()=>{
      return router.currentRoute.value.meta.externalLinkAddress || ''
    })
    return {
      url
    }
  }
})
</script>
