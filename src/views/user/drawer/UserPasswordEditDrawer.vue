<template>
  <drawer-layout
    v-model="isShow"
    :outType="userInfoDrawerDeploy.outType"
    :title="userInfoDrawerDeploy.title"
  >
    <el-form
      ref="userInfoForm"
      :model="form"
      :rules="rules"
      label-width="80px"
      style="padding: 20px"
    >
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="form.password"
          :disabled="userInfoDrawerDeploy.disabled"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="passwordConfirm">
        <el-input
          type="password"
          v-model="form.passwordConfirm"
          :disabled="userInfoDrawerDeploy.disabled"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #actions v-if="userInfoDrawerDeploy.haveSubmit">
      <el-button @click="isShow = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit('userInfoForm')">
        确认
      </el-button>
    </template>
  </drawer-layout>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue'
import { self } from '@/common'

export default defineComponent( {
  name: 'UserInfoDrawer',
  setup(props, { emit }) {
    const context = self()

    let isShow = ref(false)
    let userInfoDrawerDeploy: any = ref({})
    const validatePass = (rule: any, value: any, callback: any) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== form.value.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    const form: any = ref({
      id: '',
      password: '',
      passwordConfirm: ''
    })
    const rules = {
      password: [
        { required: true, message: '请输入密码', trigger: 'change' }
      ],
      passwordConfirm: [
        { required: true, validator: validatePass, trigger: 'blur' }
      ]
    }

    const handleSubmit = async (formName:any) => {
      const valid = await new Promise(resolve => {
        context.$refs[formName].validate((v: any) => {
          resolve(v)
        })
      })
      if (!valid) {
        return
      }
      const res: any = await context.$api.userPwd(form.value)
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
      userInfoDrawerDeploy.value = deploy
      form.value.id = data
      form.value.password = ''
      form.value.passwordConfirm = ''
    }

    return {
      open,
      handleSubmit,
      rules,
      isShow,
      form,
      userInfoDrawerDeploy
    }
  }
})
</script>
