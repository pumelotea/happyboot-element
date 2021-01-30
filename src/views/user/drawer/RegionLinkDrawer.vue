<template>
  <drawer-layout v-model="isShow" :title="deptLinkDrawerDeploy.title">
    <el-tree
      v-if="treeData.length > 0"
      v-loading="treeLoading"
      :data="treeData"
      show-checkbox
      default-expand-all
      check-strictly
      node-key="id"
      ref="tree"
      :props="defaultProps"
      :default-checked-keys="defaultChecked"
    />
    <no-data v-else />
    <template #actions>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确认</el-button>
    </template>
  </drawer-layout>
</template>

<script lang='ts'>
import { defineComponent, getCurrentInstance, ref } from 'vue'
import apis from '@/apis'

export default defineComponent({
  name: 'DeptLinkDrawer',
  setup() {
    const currentInstance: any = getCurrentInstance()
    const tree = ref(null)

    let isShow = ref(false)
    let deptLinkDrawerDeploy: any = ref({ title: '区域关联' })
    let defaultProps = { label: 'title', id: 'id' }
    let userId = ''
    let treeData: any = ref([])
    let treeLoading = ref(false)
    let defaultChecked: any = ref([])

    //接口请求树节点
    const getTreeArr = async () => {
      const res: any = await apis.getRegionTree()
      if (res.code === 0) {
        treeData = res.data
      }
    }

    const getRegionPower = async () => {
      const res: any = await apis.getUseRegionPower(userId)
      if (res.code === 0) {
        defaultChecked = res.data
      }
    }

    const userRegionEmpower = async (params: any) => {
      const res: any = await apis.userRegionEmpower(params)
      if (res.code === 0) {
        currentInstance.ctx.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success'
        })
        close()
      } else {
        currentInstance.ctx.$notify({
          title: '失败',
          message: res.msg,
          type: 'error'
        })
      }
      isShow.value = false
    }

    const loadTree = () => {
      treeLoading.value = true
      getTreeArr()
      getRegionPower()
      treeLoading.value = false
    }

    const handleSubmit = () => {
      const regionIds = (tree.value as any).getCheckedKeys()
      const params = { userId: userId, regionIds: regionIds }
      userRegionEmpower(params)
    }

    //开启抽屉的方法，可以传入一些需要的参数
    const open = (data: any) => {
      isShow.value = true
      userId = data.id
      loadTree()
    }

    const close = () => {
      isShow.value = false
    }

    return {
      open,
      close,
      handleSubmit,
      loadTree,
      userRegionEmpower,
      getTreeArr,
      getRegionPower,
      tree,
      isShow,
      treeLoading,
      deptLinkDrawerDeploy,
      defaultProps,
      userId,
      treeData,
      defaultChecked
    }
  }
})
</script>
