<template>
  <hb-drawer-layout v-model="isShow" :title="dictionaryInfoDrawerDeploy.title">
    <el-form
      ref="dictionaryInfoForm"
      :model="form"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="字典编码" prop="dictCode">
        <el-input
          v-model="form.dictCode"
          :disabled="dictionaryInfoDrawerDeploy.disabled"
        />
      </el-form-item>
      <el-form-item label="字典名称" prop="dictName">
        <el-input
          v-model="form.dictName"
          :disabled="dictionaryInfoDrawerDeploy.disabled"
        />
      </el-form-item>
      <el-form-item label="字典描述" prop="description">
        <el-input
          v-model="form.description"
          :disabled="dictionaryInfoDrawerDeploy.disabled"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-switch
          v-model="form.status"
          :disabled="dictionaryInfoDrawerDeploy.disabled"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="启用"
          inactive-text="禁用"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
    </el-form>
    <template #actions v-if="dictionaryInfoDrawerDeploy.haveSubmit">
      <el-button @click="isShow = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit('dictionaryInfoForm')"
        >确认</el-button
      >
    </template>
  </hb-drawer-layout>
</template>

<script lang='ts'>
import { defineComponent, ref, nextTick } from 'vue'
import { self } from '@/common'

export default defineComponent ({
  name: 'DictionaryInfoDrawer',
  setup(props, { emit }) {
    const context = self()

    const isShow = ref(false)
    const dictionaryInfoDrawerDeploy: any = ref({})
    const form: any = ref({
      dictCode: '',
      dictName: '',
      description: '',
      status: 1
    })
    const rules = {
      dictName: [
        { required: true, message: '请输入字典名称', trigger: 'change' }
      ],
      dictCode: [
        { required: true, message: '请输入字典编码', trigger: 'change' }
      ]
    }

    const handleSubmit = async (formName: any) => {
      const valid = await new Promise(resolve => {
        context.$refs[formName].validate((v: any) => {
          resolve(v)
        })
      })
      if (!valid) {
        return
      }
      let res: any = {}
      if (dictionaryInfoDrawerDeploy.value.mode === 'add') {
        res = await context.$api.dictAdd(form.value)
      } else if (dictionaryInfoDrawerDeploy.value.mode === 'edit') {
        res = await context.$api.dictEdit(form.value)
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
      dictionaryInfoDrawerDeploy.value = deploy
      nextTick(() => {
        //初始化表单
        form.value.dictCode = ''
        form.value.dictName = ''
        form.value.description = ''
        form.value.status = 1

        if (data !== null && data !== '') {
          context.$api.dictGet(data.id).then((res: any) => {
            if(res.code === 0) {
              form.value = res.data
            }
          })
        }
      })
    }

    return {
      handleSubmit,
      open,
      isShow,
      dictionaryInfoDrawerDeploy,
      form,
      rules
    }
  }
})
</script>
