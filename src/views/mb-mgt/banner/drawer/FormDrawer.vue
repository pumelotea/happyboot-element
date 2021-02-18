<template>
  <drawer-layout
    :loading="drawerLoading"
    v-model="drawer"
    :title="title"
  >
    <el-form
      ref="forms"
      :model="form"
      :rules="rules"
      label-width="80px"
      style="padding: 20px"
    >
      <el-form-item label="跳转地址" prop="linkUrl">
        <el-input v-model="form.linkUrl" />
      </el-form-item>
      <el-form-item label="图片" prop="imageArr">
        <image-uploader :max="1" ref="imgUper" v-model="form.imageArr" />
      </el-form-item>
      <el-form-item label="描述" prop="des">
        <el-input type="textarea" :rows="4" v-model="form.des" />
      </el-form-item>
      <el-form-item label="排序号" prop="sortOrder">
        <el-input-number v-model="form.sortOrder" :min="0" />
      </el-form-item>
      <el-form-item label="是否启用" prop="enable">
        <el-switch
          v-model="form.enable"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="启用"
          inactive-text="禁用"
          active-value="1"
          inactive-value="0"
        />
      </el-form-item>
    </el-form>
    <template #actions>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确认</el-button>
    </template>
  </drawer-layout>
</template>

<script lang='ts'>
import { partialCopying } from '@/common/utils'
import { defineComponent, nextTick, ref } from 'vue'
import { self } from '@/common'

export default defineComponent ({
  name: 'FormDrawer',
  setup(props, { emit }) {
    const context = self()

    const forms: any = ref(null)
    const imgUper: any = ref(null)

    const drawer = ref(false)
    const drawerLoading = ref(false)
    const title = ref('')
    const form = ref({
      id: '',
      linkUrl: '', //链接url地址
      imageArr: [], //图片url地址
      des: '', //描述
      enable: '1', //是否启用
      sortOrder: 0 //排序号
    })
    const rules = {
      enable: [
        { required: true, message: '请选择是否启用', trigger: 'change' }
      ],
      imageArr: [
        { required: true, message: '图片不能为空', trigger: 'change' }
      ]
    }

    const detailRequest = async (id: any, success: any) => {
      drawerLoading.value = true
      const res: any = await context.$api.detailBanner(id)
      if (res.code === 0) {
        success(res.data)
      }
      drawerLoading.value = false
    }

    const editRequest = async (params: any) => {
      const res: any = await context.$api.editBanner(params)
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
      const res: any = await context.$api.addBanner(params)
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
      initForm(data)
    }

    const edit = (data: any) => {
      drawer.value = true
      title.value = '编辑'
      detailRequest(data.id, (res: any) => {
        initForm(res)
      })
    }

    const initForm = (data: any) => {
      form.value.id = ''
      form.value.linkUrl = ''
      form.value.imageArr = []
      form.value.des = ''
      form.value.enable = '1'
      form.value.sortOrder = 0

      nextTick(() => {
        (forms.value as any).resetFields()
        form.value = partialCopying(form.value, data)
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
        if (!form.value.id) {
          addRequest(form.value)
        } else {
          editRequest(form.value)
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
      drawer,
      drawerLoading,
      title,
      form,
      rules,
      forms,
      imgUper
    }
  }
})
</script>
