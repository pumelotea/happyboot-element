<template>
  <drawer-layout
    v-model="isShow"
    :title="dictionaryConfigItemDrawerDeploy.title"
  >
    <el-form
      ref="dictionaryConfigItemForm"
      :model="form"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="名称" prop="itemText">
        <el-input v-model="form.itemText"></el-input>
      </el-form-item>
      <el-form-item label="数据值" prop="itemValue">
        <el-input v-model="form.itemValue"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item label="状态">
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
        <el-input-number v-model="form.orderId"></el-input-number>
      </el-form-item>
    </el-form>
    <template #actions>
      <el-button @click="isShow = false">取消</el-button>
      <el-button
        type="primary"
        @click="handleSubmit('dictionaryConfigItemForm')"
        >确认</el-button
      >
    </template>
  </drawer-layout>
</template>

<script lang='ts'>
import { defineComponent, getCurrentInstance, ref, nextTick } from 'vue'
import apis from '@/apis'

export default defineComponent ({
  name: 'DictionaryConfigItemDrawer',
  setup(props, { emit }) {
    const currentInstance: any = getCurrentInstance()

    const isShow = ref(false)
    const dictionaryConfigItemDrawerDeploy: any = ref({})
    const form: any = ref({
      id: '',
      dictId: '',
      itemValue: '',
      itemText: '',
      description: '',
      orderId: 0,
      status: 1
    })
    const rules = {
      itemText: [
        { required: true, message: '请输入名称', trigger: 'change' }
      ],
      itemValue: [
        { required: true, message: '请输入数据值', trigger: 'change' }
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
      if (dictionaryConfigItemDrawerDeploy.value.mode === 'add') {
        res = await apis.dictItemAdd(form.value)
      } else if (dictionaryConfigItemDrawerDeploy.value.mode === 'edit') {
        res = await apis.dictItemEdit(form.value)
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
      dictionaryConfigItemDrawerDeploy.value = deploy
      nextTick(() => {
        //初始化表单
        currentInstance.ctx.$refs['dictionaryConfigItemForm'].resetFields()
        form.value.id = ''
        form.value.dictId = data

        if (dictionaryConfigItemDrawerDeploy.value.mode === 'edit') {
          apis.dictItemGet(data).then((res: any) => {
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
      dictionaryConfigItemDrawerDeploy,
      form,
      rules
    }
  }
})
</script>
