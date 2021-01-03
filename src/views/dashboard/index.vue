<template>
  <div>dashboard - {{$route.query.title}}
    <el-input v-model="name"></el-input>
  </div>
</template>

<script>
import { defineComponent,ref } from 'vue'

export default defineComponent({
  name: 'index',
  setup(){
    const name = ref('')
    return {
      name
    }
  }
})
</script>

<style scoped>

</style>
