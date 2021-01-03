<template>
  <page-iframe-layout :url="url"></page-iframe-layout>
</template>

<script lang="ts">
import { defineComponent, computed, getCurrentInstance } from 'vue'
export default defineComponent({
  name: 'index',
  setup(){
    const self = getCurrentInstance()
    const ctx = (self as any).ctx
    const url = computed(()=>{
      return ctx.$router.currentRoute.value.meta.externalLinkAddress || ''
    })
    return {
      url
    }
  }
})
</script>
