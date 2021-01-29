<template>
  <drawer-layout
    v-model="isShow"
    :title="facilityGroupLinkDrawerDeploy.title"
    size="650px"
  >
    <el-transfer
      id="transfer"
      style="height: 500px"
      v-model="checkedGroupData"
      :data="groupData"
      :titles="['待选功能组', '已选功能组']"
      :left-default-checked="[]"
      :right-default-checked="[]"
    ></el-transfer>
    <template #actions>
      <el-button @click="isShow = false">取消</el-button>
      <el-button type="primary" @click="handleLink">确认</el-button>
    </template>
  </drawer-layout>
</template>

<script lang='ts'>
import apis from '@/apis'
import { defineComponent, getCurrentInstance } from 'vue'
export default defineComponent({
  name: 'FacilityGroupLinkDrawer',
  setup(props, { emit }) {
    const currentInstance: any = getCurrentInstance()

    let isShow = false
    let facilityGroupLinkDrawerDeploy:any = {title: '功能组关联'}
    let groupData: any = []
    let checkedGroupData:any = []
    let userId = ''

    const handleLink = async () => {
      const res: any = await apis.saveUserFacilityGroupRel(userId, checkedGroupData)
        if (res.code === 0) {
          isShow = false
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
      isShow = true
      userId = userid
      groupData = []
      checkedGroupData = []
      const res:any = await apis.facilityGroupList()
      if (res.code === 0) {
        const list:any = res.data
        for (let i = 0; i < list.length; i++) {
          groupData.push({
            key: list[i].id,
            label: list[i].facilityGroupName,
            disabled: false
          })
        }
      }
      const ret: any = await apis.queryFacilityGroupByUser(userId)
      if (ret.code === 0) {
        ret.data.map((e: any) => {
          if (e.flag) {
            checkedGroupData.push(e.id)
          }
        })
      }
    }

    return {
      handleLink,
      open,
      isShow,
      facilityGroupLinkDrawerDeploy,
      groupData,
      checkedGroupData,
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
