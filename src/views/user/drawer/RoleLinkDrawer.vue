<template>
  <drawer-layout
    v-model="isShow"
    :title="roleLinkDrawerDeploy.title"
    size="650px"
  >
    <el-transfer
      id="transfer"
      style="height: 500px"
      v-model="checkedRoleData"
      :data="roleData"
      :titles="['待选角色', '已选角色']"
    ></el-transfer>
    <template #actions>
      <el-button @click="isShow = false">取消</el-button>
      <el-button type="primary" @click="handleLink">确认</el-button>
    </template>
  </drawer-layout>
</template>

<script lang='ts'>
import { defineComponent, getCurrentInstance, ref } from 'vue'
import apis from '@/apis'

export default defineComponent({
  name: 'RoleLinkDrawer',
  setup(props, { emit }) {
    const currentInstance: any = getCurrentInstance()

    let isShow = ref(false)
    let roleLinkDrawerDeploy: any = ref({ title: '角色关联' })
    let roleData: any = ref([])
    let checkedRoleData: any = ref([])
    let userId = ''

    const handleLink = async () => {
      const res: any = await apis.saveUserRole(userId, checkedRoleData.value, '01')
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
    const open = async (userid: any) => {
      isShow.value = true
      userId = userid
      roleData.value = []
      checkedRoleData.value = []
      const res: any = await apis.roleList()
      if (res.code === 0) {
        const list = res.data
        for (let i = 0; i < list.length; i++) {
          roleData.value.push({
            key: list[i].id,
            label: list[i].roleName,
            disabled: false
          })
        }
      }
      const ret: any = await apis.queryIdsByUserIdAndType(userId, '01')
      if (ret.code === 0) {
        checkedRoleData.value = ret.data
      }
    }

    return {
      open,
      handleLink,
      isShow,
      roleLinkDrawerDeploy,
      roleData,
      checkedRoleData,
      userId
    }
  }
})
</script>

<style>
#transfer .el-transfer-panel__body {
  height: 700px;
}
#transfer .el-transfer-panel__list {
  height: 700px;
}
</style>
