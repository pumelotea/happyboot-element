<template>
  <hb-drawer-layout :loading="drawerLoading" v-model="drawer" :title="title">
    <el-form
      ref="forms"
      :model="form"
      :rules="rules"
      label-width="120px"
      style="padding: 20px"
    >
      <el-form-item label="名称" prop="deptName">
        <el-input v-model="form.deptName"></el-input>
      </el-form-item>
      <el-form-item label="是否综治中心" prop="isLeadDept">
        <el-switch
          v-model="form.isLeadDept"
          active-text="是"
          inactive-text="否"
          :active-value="'1'"
          :inactive-value="'0'"
        />
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
import { defineComponent, nextTick, ref } from 'vue'
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
      deptName: '',
      status: 1,
      isLeadDept: '0'
    })
    const rules = {
      deptName: [
        { required: true, message: '请输入部门名称', trigger: 'change' }
      ]
    }

    const getNodeData = async (id: any, success: any) => {
      drawerLoading.value = true
      const res: any = await context.$api.getDeptTreeNodeData(id)
      if (res.code === 0) {
        success(res.data)
      }
      drawerLoading.value = false
    }

    const editNode = async (params: any) => {
      const res: any = await context.$api.editDeptNode(params)
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
      const res: any = await context.$api.addDeptNode(params)
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
      getNodeData(data.id, (res: any) => {
        initForm(res)
      })
    }

    const initForm = (data: any) => {
      form.value.id = ''
      form.value.parentId = '0'
      form.value.orderId = 0
      form.value.deptName = ''
      form.value.status = 1
      form.value.isLeadDept = '0'

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

    //新增或编辑成功
    const submitSuccess = () => {
      emit('handleSubmit', form.value.parentId)
      close()
    }

    return {
      getNodeData,
      add,
      edit,
      addNode,
      editNode,
      initForm,
      close,
      handleSubmit,
      submitSuccess,
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
