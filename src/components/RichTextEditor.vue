<template>
  <div class="tinymce-editor">
    <editor
      ref="editorRef"
      v-model="myValue"
      :init="init"
      :disabled="disabled"
      :key="id"
    >
    </editor>
  </div>
</template>

<script lang="ts">
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver/theme'
import 'tinymce/plugins/image'
import 'tinymce/plugins/media'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/link'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/fullpage'
import 'tinymce/plugins/code'
import 'tinymce/plugins/charmap'
import 'tinymce/icons/default'
import { ref, toRefs, watch, defineComponent, computed, nextTick } from 'vue'
import { self } from '@/common'

export default defineComponent({
  components: {
    Editor
  },
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    plugins: {
      type: [String, Array],
      default:
        'lists image media table  wordcount  link code fullscreen fullpage charmap'
    },
    toolbar: {
      type: [String, Array],
      default: () => {
        return [
          'fullscreen undo redo   |  formatselect fontselect fontsizeselect | bold italic forecolor backcolor charmap  | alignleft aligncenter alignright alignjustify  |subscript  superscript|link unlink| bullist numlist outdent indent |  lists image media table   | removeformat '
        ]
      }
    }
  },
  setup(props, { emit }) {
    const { $api,$store } = self()
    const id =  ref('')
    const init:any = {
      selector: '',
      language_url: '/tinymce/langs/zh_CN.js',
      language: 'zh_CN',
      skin_url: '/tinymce/skins/ui/oxide',
      content_css : '/tinymce/skins/content/default/content.css',
      height: 400,
      plugins: props.plugins,
      toolbar: props.toolbar,
      branding: false,
      // menubar: 'file edit insert view format table',
      menubar: false,
      //此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
      //如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
      images_upload_handler: async (blobInfo: any, success: Function, failure: Function) => {
        const res = await $api.uploadImage(blobInfo.blob())
        if (res.code !== 0) {
          failure(res.msg)
          return
        }
        success($api.$imgId2Url(res.data))
      }
    }
    const editorRef = ref(null)

    const { modelValue } = toRefs(props)

    const myValue = ref(modelValue.value)

    watch(modelValue, (newValue) => {
      myValue.value = newValue
    })

    watch(myValue, (newValue) => {
      emit('update:modelValue', newValue)
    })

    const initEditor = (theme:string) => {
      const map:any = {
        light:{
          content_css:'/tinymce/skins/content/default/content.css',
          skin_url:'/tinymce/skins/ui/oxide',
        },
        dark:{
          content_css:'/tinymce/skins/content/dark/content.css',
          skin_url:'/tinymce/skins/ui/oxide-dark',
        }
      }
      id.value = 'richeditor-' + new Date().getTime()
      init.selector = '#' + id.value
      init.content_css = map[theme].content_css
      init.skin_url = map[theme].skin_url
      nextTick(()=>{
        tinymce.init(init)
      })
    }

    const activeTheme = computed(()=>{
      return $store.state.activeTheme
    })

    watch(activeTheme,()=>{
      tinymce.remove()
      initEditor(activeTheme.value)
    })


    return {
      id,
      init,
      myValue,
      editorRef
    }
  }
})
</script>
