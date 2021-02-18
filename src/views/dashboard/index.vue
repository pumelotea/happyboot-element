<template>
  <page-layout>
    dashboard - {{ $route.query.title }}
    <form-item-container label="asdasd">
      <el-input v-model="name"></el-input>
    </form-item-container>
    <div v-point="'add'">button</div>
    <el-button @click="openNewTab">open new self</el-button>
  </page-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { self } from '@/common'

export default defineComponent({
  name: 'index',
  setup() {
    const { $router } = self()

    const name = ref('')
    const openNewTab = () => {
      $router.push('/dashboard?id=1&title=' + name.value, name.value)
    }

    return {
      name,
      openNewTab
    }
  }
})
</script>

<style scoped>

</style>
