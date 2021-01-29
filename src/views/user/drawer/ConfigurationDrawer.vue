<template>
  <drawer-layout
    v-model="isShow"
    :title="configurationDrawerDeploy.title"
    moveToElId="page_user"
  >
    <el-form
      ref="pointForm"
      :model="form"
      :rules="rules"
      label-width="80px"
      style="padding: 20px"
    >
      <el-form-item label="功能参数" prop="facilityParam">
        <el-input
          type="textarea"
          v-model="form.facilityParam"
          :disabled="configurationDrawerDeploy.disabled"
        />
      </el-form-item>
    </el-form>
    <template #actions>
      <el-button @click="isShow = false">取消</el-button>
      <el-button
        type="danger"
        v-show="form.facilityParamId !== undefined"
        @click="handleDelete()"
        >删除</el-button
      >
      <el-button type="primary" @click="handleSubmit('pointForm')"
        >确认</el-button
      >
    </template>
  </drawer-layout>
</template>

<script lang='ts'>
import { defineComponent, getCurrentInstance } from 'vue'
import apis from '@/apis'

export default defineComponent ({
  name: 'ConfigurationDrawer',
  setup(props, { emit }) {

    let currentInstance: any = getCurrentInstance()

    let checkParam = (rule: any, value: any, callback: any) => {
      if (!value) {
        return callback(new Error('请输入功能参数'))
      }
      setTimeout(() => {
        if (!isJson(value)) {
          callback(new Error('请输入JSON格式参数'))
        } else {
          callback()
        }
      }, 1)
    }

    let form = {
      facilityId: '',
      facilityParamId: '',
      setFrom: 'user',
      userId: '',
      facilityParam: ''
    }

    let rules = { facilityParam: [{ validator: checkParam, trigger: 'change' }] }

    let isShow = false

    let configurationDrawerDeploy = { title: '参数配置' }

    const isJson = (str: string) => {
      try {
        const obj = JSON.parse(str)
        return !!(typeof obj == 'object' && obj)
      } catch (e) {
        return false
      }
    }

    const handleDelete = async () => {
      let res: any = await apis.facilityParamDelete(form.facilityParamId)
      if (res.code === 0) {
        isShow = false
        currentInstance.ctx.$notify({
          type: 'success',
          title: '提示',
          message: '操作成功！'
        })
      } else {
        currentInstance.ctx.$notify({
          type: 'error',
          title: '提示',
          message: res.msg
        })
      }
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

      let res: any = await apis.facilityParamSet(form)
      if (res.code === 0) {
        isShow = false
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
    const open = async (facilityId: any, userId: any) => {
      isShow = true
      const res: any = await apis.facilityParamGet(facilityId, 'user', '', userId)
      if (res.code === 0 && res.data !== null) {
        form = res.data
      } else {
        form = {
          facilityId: facilityId,
          setFrom: 'user',
          userId: userId,
          facilityParam: '',
          facilityParamId: ''
        }
      }
    }

    return {
      open,
      handleSubmit,
      handleDelete,
      form,
      rules,
      isShow,
      configurationDrawerDeploy
    }

  }
})
</script>
<style>
textarea {
  height: 300px;
}
</style>
