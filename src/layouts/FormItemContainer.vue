<template>
  <div class="form-item-container">
    <label class="text-label" :class="activeClass">{{ label }}</label>
    <slot></slot>
  </div>
</template>

<script>
import { defineComponent, onMounted, getCurrentInstance,ref } from 'vue'

export default defineComponent({
  name: 'FormItemContainer',
  props: {
    label: {
      type: String,
      require: false,
      default: ''
    }
  },
  setup() {
    const instance = getCurrentInstance()
    const activeClass = ref('')
    onMounted(()=>{
      const input = instance.proxy.$el.querySelector('input')
      if (input){
        input.addEventListener('focus',()=>{
          activeClass.value = 'active'
        })
        input.addEventListener('blur',()=>{
          activeClass.value = ''
        })
      }
    })
    return {
      activeClass
    }
  }
})
</script>
