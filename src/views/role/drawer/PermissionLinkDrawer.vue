<template>
  <drawer-layout
    v-model="isShow"
    :title="permissionLinkDrawerDeploy.title"
  >
    <el-tabs class="x-tabs">
      <el-tab-pane label="可用权限">
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
      </el-tab-pane>
    </el-tabs>
    <template #actions>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确认</el-button>
    </template>
  </drawer-layout>
</template>

<script lang='ts'>
import {defineComponent, getCurrentInstance, ref } from 'vue'
import apis from '@/apis'

export default defineComponent ({
  name: 'PermissionLinkDrawer',
  setup() {
    const currentInstance: any = getCurrentInstance()

    const tree: any = ref(null)

    const isShow = ref(false)
    const permissionLinkDrawerDeploy: any = ref({ title: '菜单关联' })
    const defaultProps = ref({ label: 'name', id: 'id' })
    let roleId = ''
    const treeData: any = ref([])
    const treeLoading = ref(false)
    const defaultChecked: any = ref([])

    //接口请求树节点
    const getTreeArr = async ( ) => {
      const res: any = await apis.getMenuTree()
      if (res.code === 0) {
        treeData.value = res.data
      }
    }

    const roleMenuEmpower = async (params: any)  => {
      const res: any = await apis.roleMenuEmpower(params)
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

    const loadTree = async () => {
      treeLoading.value = true
      await getTreeArr()

      const res: any = await apis.getRoleMenuPower({
        roleId: roleId,
        authType: '01',
        neTypes: ['action']
      })
      if (res.code === 0) {
        defaultChecked.value = res.data
      }

      treeLoading.value = false
    }

    const handleSubmit = () => {
      treeLoading.value = true
      const permissionIds = (tree.value as any).getCheckedKeys()
      const params = {
        roleId: roleId,
        permissionIds: permissionIds,
        authType: '01'
      }

      treeLoading.value = false
      roleMenuEmpower(params)
    }

    //开启抽屉的方法，可以传入一些需要的参数
    const open = (data: any) => {
      isShow.value = true
      roleId = data.id
      loadTree()
    }

    const close = () => {
      isShow.value = false
    }

    return {
      open,
      close,
      handleSubmit,
      getTreeArr,
      loadTree,
      roleMenuEmpower,
      isShow,
      permissionLinkDrawerDeploy,
      defaultProps,
      treeLoading,
      defaultChecked,
      treeData
    }
  }
})
</script>

<style scoped>
.x-tabs >>> .el-tabs__item:focus.is-active.is-focus:not(:active) {
  -webkit-box-shadow: none;
  box-shadow: none;
}
</style>
