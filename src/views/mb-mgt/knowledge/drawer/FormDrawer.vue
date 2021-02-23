<template>
  <hb-drawer-layout :loading="drawerLoading" v-model="drawer" :title="title">
    <el-form
      ref="forms"
      :model="form"
      :rules="rules"
      label-width="80px"
      style="padding: 20px"
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入标题"/>
      </el-form-item>
      <el-form-item label="封面" prop="pictureImages">
        <hb-image-uploader :max="1" ref="imgUper" v-model="form.imageArr" />
      </el-form-item>
      <el-form-item label="标签" prop="label">
        <el-select
          v-model="form.label"
          clearable
          placeholder="请选择标签"
          style="width: 100%"
        >
          <el-option
            v-for="item in dataDict.KNOWLEDGE_LABEL?.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="发送内容" prop="content">
        <hb-rich-text-editor v-model="form.content" />
      </el-form-item>
      <el-form-item label="备注" prop="des">
        <el-input type="textarea" :rows="2" v-model="form.des" />
      </el-form-item>
    </el-form>
    <template #actions>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确认</el-button>
    </template>
  </hb-drawer-layout>
</template>

<script lang='ts'>
import { partialCopying } from '@/common/utils'
import { defineComponent, nextTick, reactive, ref } from 'vue'
import { self } from '@/common'
import { loadDict } from '@/common/dict'

export default defineComponent ({
  name: 'FormDrawer',
  setup(props, { emit }) {
    const context = self()

    const forms: any = ref(null)
    const imgUper: any = ref(null)

    const drawer = ref(false)
    const drawerLoading = ref(false)
    const title = ref('')
    let form: any = reactive({
      id: '',
      title: '', //知识标题
      label: '', //知识标签
      imageArr: [], //知识图片
      content: '', //推送内容
      des: '' //备注
    })
    const esLabelOptions: any = ref([])
    const rules = {
      title: [
        { required: true, message: '标题不能为空', trigger: 'change' }
      ],
      label: [
        { required: true, message: '标签不能为空', trigger: 'change' }
      ],
      imageArr: [
        { required: true, message: '封面不能为空', trigger: 'change' }
      ],
      content: [
        { required: true, message: '内容不能为空', trigger: 'change' }
      ]
    }

    const { dataDict ,dictRefresh} = loadDict(['KNOWLEDGE_LABEL'],true)

    const detailRequest = async (id: any, success: any) => {
      drawerLoading.value = true
      const res: any = await context.$api.detailKnowledge(id)
      if (res.code === 0) {
        success(res.data)
      }
      drawerLoading.value = false
    }

    const editRequest = async (params: any) => {
      const res: any = await context.$api.editKnowledge(params)
      if (res.code === 0) {
        context.$notify({
          title: '成功',
          message: '编辑成功',
          type: 'success'
        })
        submitSuccess()
      } else {
        context.$notify({
          title: '失败',
          message: res.msg,
          type: 'error'
        })
      }
      drawerLoading.value = false
    }

    const addRequest = async (params: any) => {
      const res: any = await context.$api.addKnowledge(params)
      if (res.code === 0) {
        context.$notify({
          title: '成功',
          message: '新增成功',
          type: 'success'
        })
        submitSuccess()
      } else {
        context.$notify({
          title: '失败',
          message: res.msg,
          type: 'error'
        })
      }
      drawerLoading.value = false
    }

    const add = (data: any = {}) => {
      drawer.value = true
      title.value = '新增'
      dictRefresh()
      initForm(data)
    }

    const edit = (data: any) => {
      drawer.value = true
      title.value = '编辑'
      dictRefresh()
      detailRequest(data.id, (result: any) => {
        initForm(result)
      })
    }

    const initForm = (data: any) => {
      form.id = ''
      form.title = ''
      form.label = ''
      form.imageArr = []
      form.content = ''
      form.des = ''

      nextTick(() => {
        (forms.value as any).resetFields()
        form = partialCopying(form, data)
      })
    }

    const close = () => {
      drawer.value = false
    }

    const handleSubmit = async () => {
      drawerLoading.value = true
      await (imgUper.value as any).upload()
      ;(forms.value as any).validate((valid: any) => {
        if (!valid) {
          drawerLoading.value = false
          return
        }
        if (!form.id) {
          addRequest(form)
        } else {
          editRequest(form)
        }
      })
    }

    //新增或编辑成功
    const submitSuccess = () => {
      emit('handleSubmit')
      close()
    }

    return {
      detailRequest,
      editRequest,
      addRequest,
      add,
      edit,
      initForm,
      close,
      handleSubmit,
      submitSuccess,
      dataDict,
      drawer,
      drawerLoading,
      title,
      form,
      esLabelOptions,
      rules,
      forms,
      imgUper
    }
  }
})
</script>
