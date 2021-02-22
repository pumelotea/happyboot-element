<template>
  <hb-drawer-layout v-model="isShow" :title="groupDrawerDeploy.title">
    <el-form
      ref="groupForm"
      :model="form"
      :rules="rules"
      label-width="120px"
      style="padding: 20px"
    >
      <el-form-item label="功能组名称" prop="facilityGroupName">
        <el-input
          v-model="form.facilityGroupName"
          :disabled="groupDrawerDeploy.disabled"
        />
      </el-form-item>
    </el-form>
    <template #actions v-if="groupDrawerDeploy.haveSubmit">
      <el-button @click="isShow = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit('groupForm')"
        >确认</el-button
      >
    </template>
  </hb-drawer-layout>
</template>

<script lang='ts'>
import { defineComponent, nextTick, ref } from 'vue'
import { self } from '@/common'

export default defineComponent ({
  name: 'GroupDrawer',
  setup(props, { emit }) {
    const context = self()

    const isShow = ref(false)
    const groupDrawerDeploy: any = ref({})
    const form: any = ref({
      id: '',
      facilityGroupName: ''
    })
    const rules = {
      facilityGroupName: [
        { required: true, message: '请输入功能组名称', trigger: 'change' }
      ]
    }

    const handleSubmit = async (formName: any) => {
      const valid: any = await new Promise((resolve: any) => {
        context.$refs[formName].validate((v: any) => {
          resolve(v)
        })
      })
      if (!valid) {
        return
      }
      let res: any = {}
      if (groupDrawerDeploy.value.mode === 'add') {
        res = await context.$api.facilityGroupAdd(form.value)
      } else if (groupDrawerDeploy.value.mode === 'edit') {
        res = await context.$api.facilityGroupEdit(form.value)
      }
      if (res.code === 0) {
        isShow.value = false
        context.$notify({
          type: 'success',
          title: '提示',
          message: '操作成功！'
        })
        emit('ok')
      } else {
        context.$notify({
          type: 'error',
          title: '提示',
          message: res.msg
        })
      }
    }

    //开启抽屉的方法，可以传入一些需要的参数
    const open = (deploy: any, data: any) => {
      isShow.value = true
      groupDrawerDeploy.value = deploy
      nextTick(() => {
        //初始化表单
        form.value.id = ''
        form.value.facilityGroupName = ''
        if (data !== null && data !== '') {
          Object.assign(form.value, JSON.parse(JSON.stringify(data)))
        }
      })
    }

    return {
      open,
      handleSubmit,
      isShow,
      groupDrawerDeploy,
      form,
      rules
    }
  }
})
</script>
