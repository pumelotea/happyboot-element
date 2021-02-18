<template>
  <drawer-layout
    :loading="drawerLoading"
    v-model="drawer"
    :title="title"
  >
    <el-form ref="forms" :model="form" label-width="80px" style="padding: 20px">
      <el-form-item label="跳转地址" prop="linkUrl">
        <el-input v-model="form.linkUrl" readonly />
      </el-form-item>
      <el-form-item label="图片" prop="imageArr">
        <image-uploader :max="1" v-model="form.imageArr" disabled />
      </el-form-item>
      <el-form-item label="描述" prop="des">
        <el-input type="textarea" :rows="4" v-model="form.des" readonly />
      </el-form-item>
      <el-form-item label="排序号" prop="sortOrder">
        <el-input-number v-model="form.sortOrder" :min="0" disabled />
      </el-form-item>
      <el-form-item label="是否启用" prop="enable">
        <el-switch
          v-model="form.enable"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="启用"
          inactive-text="禁用"
          active-value="1"
          inactive-value="0"
          disabled
        />
      </el-form-item>
    </el-form>
  </drawer-layout>
</template>

<script lang='ts'>
import { defineComponent, nextTick, ref } from 'vue'
import { self } from '@/common'

export default defineComponent ({
  name: 'DetailDrawer',
  setup() {
    const context = self()

    const drawer = ref(false)
    const drawerLoading = ref(false)
    const dialogVisible = ref(false)
    const title = ref('')
    const form = ref({
      id: '',
      linkUrl: '', //链接url地址
      imageArr: [], //图片url地址
      des: '', //描述
      enable: '1', //是否启用
      sortOrder: 0 //排序号
    })

    const detailRequest = async (id: any, success: any) => {
      drawerLoading.value = true
      const res: any = await context.$api.detailBanner(id)
      if (res.code === 0) {
        success(res.data)
      }
      drawerLoading.value = false
    }

    const detail = (data: any) => {
      drawer.value = true
      title.value = '详情'
      detailRequest(data.id, (res: any) => {
        nextTick(() => {
          Object.assign(form.value, JSON.parse(JSON.stringify(res)))
        })
      })
    }

    const close = () => {
      form.value.id = ''
      form.value.linkUrl = ''
      form.value.imageArr = []
      form.value.des = ''
      form.value.enable = '1'
      form.value.sortOrder = 0

      drawer.value = false
    }

    return {
      detailRequest,
      detail,
      close,
      drawer,
      drawerLoading,
      dialogVisible,
      title,
      form
    }
  }
})
</script>
