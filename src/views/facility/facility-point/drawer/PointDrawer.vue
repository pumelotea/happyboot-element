<template>
  <hb-drawer-layout v-model="isShow" :title="pointDrawerDeploy.title">
    <el-form
      ref="pointForm"
      :model="form"
      :rules="rules"
      label-width="80px"
      style="padding: 20px"
    >
      <el-form-item label="功能名称" prop="facilityName">
        <el-input
          v-model="form.facilityName"
          :disabled="pointDrawerDeploy.disabled"
        />
      </el-form-item>
      <el-form-item label="功能标识" prop="facilityKey">
        <el-input
          v-model="form.facilityKey"
          :disabled="pointDrawerDeploy.disabled"
        />
      </el-form-item>
      <el-form-item label="功能图标" prop="facilityIcon">
        <el-input
          v-model="form.facilityIcon"
          :disabled="pointDrawerDeploy.disabled"
        />
      </el-form-item>
      <el-form-item label="功能类型" prop="facilityType">
        <el-select
          v-model="form.facilityType"
          :disabled="pointDrawerDeploy.disabled"
          clearable
          placeholder="请选择类型"
          style="width: 100%"
        >
          <el-option
            v-for="item in dataDict.FACILITY_TYPE?.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="功能平台" prop="facilityPlatform">
        <el-select
          v-model="form.facilityPlatform"
          :disabled="pointDrawerDeploy.disabled"
          clearable
          placeholder="请选择平台"
          style="width: 100%"
        >
          <el-option
            v-for="item in dataDict.FACILITY_PLATFORM?.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="des">
        <el-input v-model="form.des" :disabled="pointDrawerDeploy.disabled" />
      </el-form-item>
    </el-form>
    <template #actions v-if="pointDrawerDeploy.haveSubmit">
      <el-button @click="isShow = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit('pointForm')"
      >确认
      </el-button
      >
    </template>
  </hb-drawer-layout>
</template>

<script lang='ts'>
import { defineComponent, nextTick, ref } from 'vue'
import { self } from '@/common'
import { loadDict } from '@/common/dict'

export default defineComponent({
  name: 'PointDrawer',
  setup(props, { emit }) {
    const context = self()

    const isShow = ref(false)
    const pointDrawerDeploy: any = ref({})
    const form = ref({
      id: '',
      facilityName: '',
      facilityKey: '',
      facilityPlatform: '',
      facilityType: '',
      facilityIcon: '',
      des: ''
    })
    const rules = {
      facilityName: [
        { required: true, message: '请输入功能名称', trigger: 'change' }
      ],
      facilityKey: [
        { required: true, message: '请输入功能标识', trigger: 'change' }
      ],
      facilityType: [
        { required: true, message: '请选择功能类型', trigger: 'change' }
      ],
      facilityPlatform: [
        { required: true, message: '请选择功能平台', trigger: 'change' }
      ]
    }

    const { dataDict, dictRefresh } = loadDict(['FACILITY_PLATFORM', 'FACILITY_TYPE'],true)

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
      if (pointDrawerDeploy.value.mode === 'add') {
        res = await context.$api.facilityAdd(form.value)
      } else if (pointDrawerDeploy.value.mode === 'edit') {
        res = await context.$api.facilityEdit(form.value)
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
      pointDrawerDeploy.value = deploy
      dictRefresh()
      nextTick(() => {
        //初始化表单
        form.value.id = ''
        form.value.facilityName = ''
        form.value.facilityKey = ''
        form.value.facilityPlatform = ''
        form.value.facilityType = ''
        form.value.facilityIcon = ''
        form.value.des = ''

        if (data !== null && data !== '') {
          Object.assign(form.value, JSON.parse(JSON.stringify(data)))
        }
      })
    }

    return {
      handleSubmit,
      open,
      isShow,
      pointDrawerDeploy,
      form,
      rules,
      dataDict
    }
  }
})
</script>
