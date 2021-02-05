<template>
  <div class="div-detail" v-show="show">
    <el-form
      ref="forms"
      :model="form"
      label-width="120px"
      style="padding: 20px"
    >
      <el-form-item label="名称" prop="deptName">
        <el-input v-model="form.deptName" readonly></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="orderId">
        <el-input-number v-model="form.orderId" :min="0" :max="10" disabled />
      </el-form-item>
      <el-form-item label="是否综治中心" prop="isLeadDept">
        <el-switch
          v-model="form.isLeadDept"
          active-text="是"
          inactive-text="否"
          :active-value="'1'"
          :inactive-value="'0'"
          disabled
        />
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
    </el-form>
  </div>
</template>
<script lang='ts'>
import { defineComponent, nextTick, ref } from 'vue'
import { self } from '@/common'

export default defineComponent ({
  name: 'index',
  setup() {
    const context = self()

    const drawerLoading = ref(false)
    const show = ref(false)
    const showIcons = ref(false)
    const title = ref('')
    const form: any = ref({
      parentId: '0',
      orderId: 0,
      deptName: '',
      status: 1,
      isLeadDept: '0'
    })

    const getNodeData = async (id: any, success: any) => {
      drawerLoading.value = true
      const res: any = await context.$api.getDeptTreeNodeData(id)
      if (res.code === 0) {
        success(res.data)
      }
      drawerLoading.value = false
    }

    const open = (data: any) => {
      show.value = true
      getNodeData(data.id, (res: any) => {
        initForm(res)
      })
    }

    const initForm = (data: any) => {
      nextTick(() => {
        Object.assign(form.value, JSON.parse(JSON.stringify(data)))
      })
    }

    const iconChoose = (ico: any) => {
      if (ico) {
        form.value.icon = ico
      }
      showIcons.value = false
    }

    return {
      getNodeData,
      open,
      initForm,
      iconChoose,
      drawerLoading,
      show,
      showIcons,
      title,
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
