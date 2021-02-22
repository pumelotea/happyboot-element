<template>
  <hb-drawer-layout :loading="drawerLoading" v-model="drawer" :title="title">
    <el-form ref="forms" :model="form" label-width="80px" style="padding: 20px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" readonly />
      </el-form-item>
      <el-form-item label="封面" prop="imageArr">
        <hb-image-uploader :max="1" v-model="form.imageArr" disabled />
      </el-form-item>
      <el-form-item label="标签" prop="label">
        <el-select
          v-model="form.label"
          clearable
          placeholder="请选择"
          style="width: 100%"
          disabled
        >
          <el-option
            v-for="item in esLabelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="发送内容" prop="content">
        <hb-rich-text-editor v-model="form.content" disabled />
      </el-form-item>
      <el-form-item label="备注" prop="des">
        <el-input type="textarea" :rows="2" v-model="form.des" readonly />
      </el-form-item>
    </el-form>
  </hb-drawer-layout>
</template>

<script lang='ts'>
import { defineComponent, ref, reactive, onMounted, nextTick } from 'vue'
import { self } from '@/common'

export default defineComponent ({
  name: 'DetailDrawer',
  setup() {
    const context = self()

    const forms: any = ref(null)

    const drawer = ref(false)
    const drawerLoading = ref(false)
    const dialogVisible = ref(false)
    const title = ref('')
    const form = reactive({
      id: '',
      title: '', //知识标题
      label: '', //知识标签
      imageArr: [], //知识图片
      content: '', //推送内容
      des: '' //备注
    })
    const esLabelOptions: any = ref([])

    //初始化字典
    const getDict = async (success: any, error: any) => {
      const res: any = await context.$api.dictItemsMap('KNOWLEDGE_LABEL')
      if (res.code === 0) {
        success(res.data)
      } else {
        error()
      }
    }

    const detailRequest = async (id: any, success: any) => {
      drawerLoading.value = true
      const result = await context.$api.detailKnowledge(id)
      if (result.code === 0) {
        success(result.data)
      }
      drawerLoading.value = false
    }

    const initDict = () => {
      //初始化字典
      getDict(
          (success: any) => {
            esLabelOptions.value = success.KNOWLEDGE_LABEL
          },
          (err: any) => {
            context.$notify({
              type: 'error',
              title: '提示',
              message: err.msg
            })
          }
      )
    }

    const detail = (data: any) => {
      drawer.value = true
      title.value = '详情'
      detailRequest(data.id, (res: any) => {
        nextTick(() => {
          Object.assign(form, JSON.parse(JSON.stringify(res)))
        })
      })
    }

    const close = () => {
      form.id = ''
      form.title = ''
      form.label = ''
      form.imageArr = []
      form.content = ''
      form.des = ''

      drawer.value = false
    }

    onMounted(() => {
      initDict()
    })

    return {
      initDict,
      getDict,
      detailRequest,
      detail,
      close,
      drawer,
      drawerLoading,
      dialogVisible,
      title,
      form,
      esLabelOptions,
      forms
    }
  }
})
</script>
