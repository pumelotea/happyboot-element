<template>
  <drawer-layout v-model="isShow" :title="roleInfoDrawerDeploy.title">
    <el-form ref="roleInfoForm" :model="form" :rules="rules" label-width="80px" style="padding: 20px">
      <el-form-item label="角色编码" prop="authorityName">
        <el-input
          v-model="form.authorityName"
          :disabled="roleInfoDrawerDeploy.disabled"
        />
      </el-form-item>
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          v-model="form.roleName"
          :disabled="roleInfoDrawerDeploy.disabled"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-switch
          v-model="form.status"
          :disabled="roleInfoDrawerDeploy.disabled"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="启用"
          inactive-text="禁用"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
    </el-form>
    <template #actions v-if="roleInfoDrawerDeploy.haveSubmit">
      <el-button @click="isShow = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit('roleInfoForm')"
        >确认</el-button
      >
    </template>
  </drawer-layout>
</template>

<script lang='ts'>
import { defineComponent, getCurrentInstance, ref, nextTick } from 'vue'
import apis from '@/apis'

export default defineComponent ({
  name: 'RoleInfoDrawer',
  setup(props, { emit }) {
    const currentInstance: any = getCurrentInstance()

    const isShow = ref(false)
    const roleInfoDrawerDeploy: any = ref({})
    const form: any = ref({
      id: '',
      authorityName: '',
      roleName: '',
      status: 1,
      roleType: ''
    })
    const rules = {
      roleName: [
        { required: true, message: '请输入角色名称', trigger: 'change' }
      ],
      authorityName: [
        { required: true, message: '请输入角色编码', trigger: 'change' }
      ]
    }

    const handleSubmit = async (formName: any) => {
      const valid = await new Promise(resolve => {
        currentInstance.ctx.$refs[formName].validate((v: any) => {
          resolve(v)
        })
      })
      if (!valid) {
        return
      }
      let res: any = {}
      if (roleInfoDrawerDeploy.value.mode === 'add') {
        res = await apis.roleAdd(form.value)
      } else if (roleInfoDrawerDeploy.value.mode === 'edit') {
        res = await apis.roleEdit(form.value)
      }
      if (res.code === 0) {
        isShow.value = false
        currentInstance.ctx.$notify({
          type: 'success',
          title: '提示',
          message: '操作成功！'
        })
        emit('ok')
      } else {
        currentInstance.ctx.$notify({
          type: 'error',
          title: '提示',
          message: res.msg
        })
      }
    }

    //开启抽屉的方法，可以传入一些需要的参数
    const open = (deploy: any, data: any) => {
      isShow.value = true
      roleInfoDrawerDeploy.value = deploy
      nextTick(() => {
        //初始化表单
        form.value.id = ''
        form.value.roleName = ''
        form.value.authorityName = ''
        form.value.status = 1
        form.value.roleType = ''

        if (data !== null && data !== '') {
          apis.roleGet(data.id).then((res: any) => {
            if(res.code === 0){
              form.value = res.data
            }
          })
        }
      })
    }

    return {
      open,
      handleSubmit,
      isShow,
      roleInfoDrawerDeploy,
      form,
      rules
    }
  }
})
</script>
