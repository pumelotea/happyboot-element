<template>
  <hb-drawer-layout :loading="drawerLoading" v-model="drawer" :title="title">
    <el-form
      ref="forms"
      :model="form"
      :rules="rules"
      label-width="80px"
      style="padding: 20px"
    >
      <el-form-item label="名称" prop="regionName">
        <el-input v-model="form.regionName"></el-input>
      </el-form-item>
      <el-form-item label="是否禁用" prop="status">
        <el-switch
          v-model="form.status"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="启用"
          inactive-text="禁用"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item label="排序号" prop="orderId">
        <el-input-number v-model="form.orderId" :min="0" :max="10" />
      </el-form-item>
    </el-form>
    <template #actions>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确认</el-button>
    </template>
  </hb-drawer-layout>
</template>
<script lang='ts'>
import { defineComponent, ref, nextTick } from 'vue'
import { self } from '@/common'
import { partialCopying } from '@/common/utils'

export default defineComponent ({
  name: 'FormDrawer',
  setup(props, { emit }) {
    const context = self()

    const forms: any = ref(null)

    const drawerLoading = ref(false)
    const drawer = ref(false)
    const title = ref('')
    const form = ref({
      id: '',
      parentId: '0',
      orderId: 0,
      regionName: '',
      status: 1
    })
    const rules = {
      regionName: [{ required: true, message: '请输入部门名称', trigger: 'change' }]
    }

    const getNodeData = async (id: any, success: any) => {
      drawerLoading.value = true
      const res: any = await context.$api.getDeptRegionTreeNodeData(id)
      if (res.code === 0) {
        success(res.data)
      }
      drawerLoading.value = false
    }

    const editNode = async (params: any) => {
      const res: any = await context.$api.editDeptRegionNode(params)
      if (res.code === 0) {
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

    const addNode = async (params: any) => {
      const res: any = await context.$api.addDeptRegionNode(params)
      if (res.code === 0) {
        context.$notify({
          title: '成功',
          message: '操作成功',
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
      getNodeData(data.id, (result: any) => {
        initForm(result)
      })
    }

    const initForm = (data: any) => {
      form.value.id = ''
      form.value.parentId = '0'
      form.value.orderId = 0
      form.value.regionName = ''
      form.value.status = 1

      nextTick(() => {
        (forms.value as any).resetFields()
        form.value = partialCopying(form.value, data)
      })
    }

    const close = () => {
      drawer.value = false
    }

    const handleSubmit = () => {
      drawerLoading.value = true
      ;(forms.value as any).validate((valid: any) => {
        if (!valid) {
          drawerLoading.value = false
          return
        }
        if (!form.value.id) {
          addNode(form.value)
        } else {
          editNode(form.value)
        }
      })
    }

    const submitSuccess = () => {
      emit('handleSubmit', form.value.parentId)
      close()
    }

    return {
      initForm,
      handleSubmit,
      submitSuccess,
      close,
      add,
      edit,
      getNodeData,
      addNode,
      editNode,
      drawerLoading,
      drawer,
      title,
      form,
      rules,
      forms
    }
  }
})
</script>
