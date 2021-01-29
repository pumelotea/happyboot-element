<template>
  <drawer-layout
    v-model="isShow"
    :title="deptLinkDrawerDeploy.title"
    size="650px"
  >
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
      @check="nodeCheck"
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

export default defineComponent (
  {
    name: 'RegionLinkDrawer',
    setup (){

      const currentInstance: any = getCurrentInstance()
      const tree = ref(null)

      let isShow = false
      let deptLinkDrawerDeploy: any = {title: '部门关联'}
      let defaultProps = { label: 'title', id: 'id' }
      let userId = ''
      let treeData: any = []
      let treeLoading = false
      let defaultChecked: any = []

      //接口请求树节点
      const getTreeArr = async () => {
        const res: any = await apis.getDeptTree()
        if (res.code === 0) {
          treeData = res.data
        }
      }

      const getDeptPower = async () => {
        const res: any = await apis.getUserDeptPower(userId)
        if (res.code === 0 && res.data !== null) {
          defaultChecked = [res.data]
        }
      }

      const userDeptEmpower = async (params: any) => {
        const res: any = await apis.userDeptEmpower(params)
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
        isShow = false
      }

      const loadTree = () => {
        treeLoading = true
        getTreeArr()
        getDeptPower()
        treeLoading = false
      }

      const handleSubmit = () => {
        let deptId = ''
        if ((tree.value as any).getCheckedKeys().length > 0) {
          deptId = (tree.value as any).getCheckedKeys()[0]
        }
        const params = { userId: userId, deptId: deptId }
        userDeptEmpower(params)
      }

      //开启抽屉的方法，可以传入一些需要的参数
      const open = (data: any) => {
        isShow = true
        userId = data.id
        loadTree()
      }

      const close = () => {
        isShow = false
      }

      //点击事件
      const nodeCheck = (data: any) => {
        (tree.value as any).setCheckedKeys([data.id])
      }

      return{
        getTreeArr,
        handleSubmit,
        nodeCheck,
        open,
        close,
        isShow,
        deptLinkDrawerDeploy,
        defaultProps,
        userId,
        treeData,
        treeLoading,
        defaultChecked,
        tree
      }
    }
  }
)
</script>
