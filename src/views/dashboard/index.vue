<template>
  <page-layout>
    <rich-text-editor v-model="aaa"/>
    {{aaa}}
  </page-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import RichTextEditor from '@/components/RichTextEditor.vue'

export default defineComponent({
  name: 'index',
  components: { RichTextEditor },
  setup() {
    const aaa = ref('0000')

    return {
      aaa
    }
  }
})
</script>

<style scoped>

</style>
