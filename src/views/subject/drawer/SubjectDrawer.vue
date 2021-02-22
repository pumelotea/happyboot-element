<template>
  <hb-drawer-layout v-model="isShow" :title="subjectDrawerDeploy.title">
    <el-form
      ref="subjectForm"
      :model="form"
      :rules="rules"
      label-width="80px"
      style="padding: 20px"
    >
      <el-form-item label="主体名称" prop="subjectName">
        <el-input
          v-model="form.subjectName"
          :disabled="subjectDrawerDeploy.disabled"
        />
      </el-form-item>
    </el-form>
    <template #actions v-if="subjectDrawerDeploy.haveSubmit">
      <el-button @click="isShow = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit('subjectForm')"
        >确认</el-button
      >
    </template>
  </hb-drawer-layout>
</template>

<script lang='ts'>
import { defineComponent, ref, nextTick } from 'vue'
import { self } from '@/common'

export default defineComponent ({
  name: 'SubjectDrawer',
  setup(props, { emit }) {
    const context = self()

    const isShow = ref(false)
    const subjectDrawerDeploy: any = ref({})
    const form: any = ref({
      id: '',
      subjectName: '',
      regionIds: []
    })
    const rules = {
      subjectName: [
        { required: true, message: '请输入对主体名称', trigger: 'change' }
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
      if (subjectDrawerDeploy.value.mode === 'add') {
        res = await context.$api.subjectAdd(form.value)
      } else if (subjectDrawerDeploy.value.mode === 'edit') {
        res = await context.$api.subjectEdit(form.value)
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
      subjectDrawerDeploy.value = deploy
      nextTick(() => {
        //初始化表单
        form.value.id = ''
        form.value.subjectName = ''
        form.value.regionIds = []

        if (data != null && data !== '') {
          context.$api.subjectGet(data.id).then((res: any) => {
            if (res.code === 0) {
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
      subjectDrawerDeploy,
      form,
      rules
    }
  }
})
</script>
