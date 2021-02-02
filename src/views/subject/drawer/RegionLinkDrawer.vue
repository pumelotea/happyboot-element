<template>
  <drawer-layout
    v-model="isShow"
    :title="regionLinkDrawerDeploy.title"
  >
    <el-tree
      v-loading="treeLoading"
      :props="props"
      :data="treeData"
      default-expand-all
      :check-strictly="true"
      :default-checked-keys="defaultChecked"
      node-key="id"
      ref="tree"
      show-checkbox
      @check-change="nodeCheck"
    >
    </el-tree>
    <template #actions>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确认</el-button>
    </template>
  </drawer-layout>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue'
import { self } from '@/common'

export default defineComponent ({
  name: 'RegionLinkDrawer',
  setup() {
    const context = self()

    const tree: any = ref(null)

    const isShow = ref(false)
    const regionLinkDrawerDeploy:any = ref({ title: '区域关联' })
    const treeData: any = ref([])
    const props: any = ref({
      label: 'title',
      children: 'children',
      isLeaf: 'leaf',
      disabled: 'disabled',
      id: 'id'
    })
    const defaultChecked: any = ref([])
    const checkedNode: any = ref({})
    const treeLoading = ref(false)
    const rootNode: any = ref({ node: {}, resolve: null })
    const form: any = ref({
      id: '',
      objName: '',
      status: '',
      regionIds: []
    })

    //接口请求树节点
    const getTreeArr = async () => {
      const res: any = await context.$api.getRegionTree()
      if (res.code === 0) {
        treeData.value = res.data
      }
    }

    const getObjectRegion = async () => {
      const res: any = await context.$api.queryIdsByObjId(form.value.id)
      if (res.code === 0) {
        defaultChecked.value = res.data
      }
    }

    const loadTree = () => {
      treeLoading.value = true
      getTreeArr()
      getObjectRegion()
      treeLoading.value = false
    }

    const handleSubmit = async () => {
      form.value.regionIds = (tree.value as any).getCheckedKeys()
      const params = {
        objId: form.value.id,
        regionIds: form.value.regionIds
      }
      const res: any = await context.$api.saveObjRegion(params)
      if (res.code === 0) {
        isShow.value = false
        context.$notify({
          type: 'success',
          title: '提示',
          message: '操作成功！'
        })
      } else {
        context.$notify({
          type: 'error',
          title: '提示',
          message: res.msg
        })
      }
    }

    //开启抽屉的方法，可以传入一些需要的参数
    const open = (data: any) => {
      isShow.value = true
      form.value.id = data.id
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
      getObjectRegion,
      getTreeArr,
      isShow,
      regionLinkDrawerDeploy,
      treeData,
      props,
      defaultChecked,
      checkedNode,
      treeLoading,
      rootNode,
      form,
      tree
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
