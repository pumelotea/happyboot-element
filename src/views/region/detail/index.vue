<template>
  <div class="div-detail" v-show="show">
    <el-form ref="forms" :model="form" label-width="80px" style="padding: 20px">
      <el-form-item label="名称" prop="regionName">
        <el-input v-model="form.regionName" readonly></el-input>
      </el-form-item>
      <el-form-item label="是否禁用" prop="status">
        <el-switch
          v-model="form.status"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="启用"
          inactive-text="禁用"
          :active-value="1"
          :inactive-value="0"
          disabled
        />
      </el-form-item>
      <el-form-item label="排序号" prop="orderId">
        <el-input-number v-model="form.orderId" :min="0" :max="10" disabled />
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang='ts'>
import { defineComponent, ref, nextTick } from 'vue'
import { self } from '@/common'

export default defineComponent ({
  name: 'index',
  setup() {
    const context = self()

    const drawerLoading = ref(false)
    const show = ref(false)
    const form = ref({
      parentId: '0',
      orderId: 0,
      regionName: '',
      status: 1
    })

    const getNodeData = async (id: any, success: any) => {
      drawerLoading.value = true
      const res: any = await context.$api.getDeptRegionTreeNodeData(id)
      if (res.code === 0) {
        success(res.data)
      }
      drawerLoading.value = false
    }

    const open = (data: any) => {
      show.value = true
      getNodeData(data.id, (result: any) => {
        initForm(result)
      })
    }

    const initForm = (data: any) => {
      nextTick(() => {
        Object.assign(form.value, JSON.parse(JSON.stringify(data)))
      })
    }

    return {
      open,
      initForm,
      getNodeData,
      drawerLoading,
      show,
      form
    }
  }
})
</script>
<style scoped>
.div-detail {
  overflow: auto;
  position: relative;
  width: 100%;
  top: -100px;
}
</style>
