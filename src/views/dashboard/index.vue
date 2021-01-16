<template>
  <div>
    dashboard - {{$route.query.title}}
    <el-input v-model="name"></el-input>
    <el-button @click="openNewTab">open new self</el-button>
  </div>

</template>

<script lang="ts">
import { defineComponent,ref } from 'vue'
import router from '@/router'
import { HappyKitRouter } from 'happykit'
// import { getHappykitInstance } from '@/framework'
export default defineComponent({
  name: 'index',
  setup(){
    const name = ref('')
    // const hkf = getHappykitInstance()
    const openNewTab = () => {
      (router as HappyKitRouter ).push('/dashboard1?id=1&title=123123','hahha')
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
