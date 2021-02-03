<template>
  <drawer-layout v-model="isShow" :title="configurationDrawerDeploy.title">
    <el-form ref="configurationForm" :model="form" :rules="rules" label-width="80px" style="padding: 20px">
      <el-form-item label="参数名" prop="key">
        <el-input
          v-model="form.key"
          :disabled="configurationDrawerDeploy.disabled"
        />
      </el-form-item>
      <el-form-item label="参数值" prop="value">
        <el-input
          v-model="form.value"
          :disabled="configurationDrawerDeploy.disabled"
        />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select
          v-model="form.type"
          :disabled="configurationDrawerDeploy.disabled"
          clearable
          placeholder="请选择类型"
          style="width: 100%"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="form.remark"
          :disabled="configurationDrawerDeploy.disabled"
        />
      </el-form-item>
    </el-form>
    <template #actions v-if="configurationDrawerDeploy.haveSubmit">
      <el-button @click="isShow = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit('configurationForm')"
        >确认</el-button
      >
    </template>
  </drawer-layout>
</template>

<script lang='ts'>
import { defineComponent, onMounted, ref, nextTick } from 'vue'
import { self } from '@/common'
export default defineComponent ({
  name: 'ConfigurationDrawer',
  setup(props, { emit }) {
    const context = self()

    const isShow = ref(false)
    const configurationDrawerDeploy: any = ref({})
    const typeOptions: any = ref([])
    const form = ref({
      id: '',
      key: '',
      value: '',
      type: '',
      remark: ''
    })
    const rules = {
      key: [
        { required: true, message: '请输入参数名', trigger: 'change' }
      ],
      value: [
        { required: true, message: '请输入参数值', trigger: 'change' }
      ],
      type: [
        { required: true, message: '请选择类型', trigger: 'change' }
      ]
    }

    //初始化字典
    const initDict = async () => {
      const res: any = await context.$api.dictItemsMap('SYS_CONFIG_TYPE')
      if (res.code === 0) {
        typeOptions.value = []
        typeOptions.value = res.data.SYS_CONFIG_TYPE
      } else {
        context.$notify({
          type: 'error',
          title: '提示',
          message: res.msg
        })
      }
    }

    const handleSubmit = async (formName: any) => {
      const valid = await new Promise((resolve: any) => {
        context.$refs[formName].validate((v: any) => {
          resolve(v)
        })
      })
      if (!valid) {
        return
      }
      let res: any = {}
      if (configurationDrawerDeploy.value.mode === 'add') {
        res = await context.$api.configAdd(form.value)
      } else if (configurationDrawerDeploy.value.mode === 'edit') {
        res = await context.$api.configEdit(form.value)
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
      configurationDrawerDeploy.value = deploy
      nextTick(() => {
        //初始化表单
        form.value.id = ''
        form.value.key = ''
        form.value.value = ''
        form.value.type = ''
        form.value.remark = ''

        if (data !== null && data !== '') {
          Object.assign(form.value, JSON.parse(JSON.stringify(data)))
        }
      })
    }

    onMounted(() => {
      initDict()
    })

    return {
      open,
      initDict,
      handleSubmit,
      isShow,
      configurationDrawerDeploy,
      typeOptions,
      form,
      rules
    }
  }
})
</script>
