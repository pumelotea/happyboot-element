<template>
  <hb-page-layout>
    <hb-rich-text-editor v-model="aaa"/>
    {{aaa}}
  </hb-page-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import HbRichTextEditor from '@/components/HbRichTextEditor.vue'

export default defineComponent({
  name: 'index',
  components: { HbRichTextEditor },
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
