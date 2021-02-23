<template>
  <hb-page-layout>
    <template #actions>
      <el-row :gutter="10" style="margin-top: 15px">
        <el-col>
          <el-button
            type="primary"
            size="medium"
            permission-key="add"
            @click="add(checkedNode)"
          >
            新增
          </el-button>
        </el-col>
      </el-row>
    </template>
    <el-row>
      <el-col :span="12">
        <el-tree
          v-if="hasData"
          v-loading="treeLoading"
          :data="treeData"
          :props="defaultProps"
          @check-change="nodeCheck"
          @node-drop="nodeDrop"
          @node-click="nodeClick"
          :allow-drop="allowDrop"
          :allow-drag="allowDrag"
          check-strictly
          draggable
          lazy
          :load="loadNode"
          node-key="id"
          ref="tree"
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span v-if="!node.disabled">
              <el-button
                title="新增"
                type="text"
                size="medium"
                @click.stop="() => add(data)"
              >
                <i class="el-icon-plus"></i>
              </el-button>
              <el-button
                title="修改"
                type="text"
                size="medium"
                @click.stop="() => edit(data)"
              >
                <i class="el-icon-edit"></i>
              </el-button>
              <el-button
                slot="reference"
                title="删除"
                type="text"
                size="medium"
                @click.stop="() => remove(node, data)"
              >
                <i class="el-icon-delete"></i>
              </el-button>
            </span>
          </span>
          </template>
        </el-tree>
        <no-data v-else />
      </el-col>
      <el-col :span="12">
        <detail ref="RD" />
      </el-col>
    </el-row>
    <form-drawer ref="FD" @handleSubmit="handleSubmit" />
  </hb-page-layout>
</template>

<script lang='ts'>
import { defineComponent, onMounted, ref } from 'vue'
import { self } from '@/common'
import FormDrawer from './drawer/FormDrawer.vue'
import Detail from './detail/index.vue'
import { drawerLoader } from '@/common/drawer'
export default defineComponent ({
  name: 'index',
  components: {
    FormDrawer,
    Detail
  },
  setup() {
    const context = self()
    const drawer = drawerLoader()
    const tree: any = ref(null)

    const treeData = ref([])
    const defaultProps = {
      label: 'title',
      isLeaf: 'leaf',
      disabled: 'disabled',
      id: 'id'
    }
    const checkedNode: any = ref({})
    const treeLoading = ref(false)
    const rootNode: any = ref({ node: {}, resolve: null })
    const hasData = ref(false)

    //接口请求树节点
    const getNode =  async (id: any = 0, success: any) => {
      const res: any = await context.$api.getDeptRegionTreeByParentId(id)
      if (res.code === 0) {
        success(res.data)
      }
    }

    //接口移动树节点
    const moveNode = async (params: any, done: any) => {
      const res = await context.$api.modifyDeptRegionNode(params)
      if (res.code !== 0) {
        context.$notify({
          title: '失败',
          message: res.msg,
          type: 'error'
        })
      }
      done()
    }

    //接口删除节点
    const removeNode = async (id: any, done: any) => {
      const res = await context.$api.deleteDeptRegionNode(id)
      if (res.code === 0) {
        context.$notify({
          title: '成功',
          message: res.msg,
          type: 'success'
        })
      } else {
        context.$notify({
          title: '失败',
          message: res.msg,
          type: 'error'
        })
      }
      done()
    }

    const loadNode = (node: any, resolve: any) => {
      let fatherId = 0
      if (node.level === 0) {
        rootNode.value.node = node
        rootNode.value.resolve = resolve
      } else {
        fatherId = node.key
      }
      getNode(fatherId, (children: any) => {
        resolve(children || [])
      })
    }

    const nodeCheck = (node: any, checked: any) => {
      if (checked) {
        (tree.value as any).setCheckedNodes([node])
      }
      checkedNode.value = (tree.value as any).getCheckedNodes()[0] || {}
    }

    // 被拖拽节点对应的 Node、
    // 结束拖拽时最后进入的节点、
    // 被拖拽节点的放置位置（before、after、inner）
    const nodeDrop = (draggingNode: any, dropNode: any, dropType: any) => {
      beginLoading()
      dropNode.isLeaf = false
      let nodeData: any = {}
      if (dropType === 'before' || dropType === 'after') {
        nodeData = {
          parentId: dropNode.data.parentId || '0',
          id: draggingNode.data.id
        }
      } else if (dropType === 'inner') {
        nodeData = {
          parentId: dropNode.data.id || '0',
          id: draggingNode.data.id
        }
      }
      moveNode(nodeData, () => {
        handleSubmit(nodeData.parentId)
        endLoading()
      })
    }

    const add = (data: any) => {
      let newNode = {}
      //不直接用data.hasOwnProperty('id')是为了代码规范
      if (Object.prototype.hasOwnProperty.call(data, 'id')) {
        newNode = { parentId: data.id }
      }
      drawer('FD').add(newNode)
    }

    const edit = (data: any) => {
      drawer('FD').edit(data)
    }

    const remove = (node: any, data: any) => {
      context.$confirm('即将删除该条数据, 是否确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        beginLoading()
        removeNode(data.id, () => {
          //最后
          handleSubmit(data.parentid)
          endLoading()
        })
      })
    }

    const beginLoading = () => {
      treeLoading.value = true
    }

    const endLoading = () => {
      treeLoading.value = false
    }

    const findNodeById = (id: any) => {
      return (tree.value as any).getNode(id)
    }

    const handleSubmit = (id: any) => {
      if (id == null || id === '0') {
        rootNode.value.node.childNodes = []
        loadNode(rootNode.value.node, rootNode.value.resolve)
        return
      }
      const node = (tree.value as any).getNode(id)
      //关闭再打开重新加载，等于是小面积重新加载数据parent
      node.collapse()
      node.loaded = false
      node.expand()
    }

    //能否被拖拽
    const allowDrag = (node: any) => {
      return !node.disabled
    }

    //能否被拖拽入
    const allowDrop = (draggingNode: any, dropNode: any, dropType: any) => {
      if (dropType === 'prev' || dropType === 'next') {
        if (
          draggingNode.data.parentId === dropNode.data.parentId ||
          dropNode.data.parentId === '0'
        ) {
          return false
        }
      }
      return true
    }

    const nodeClick = (data: any) => {
      drawer('RD').open(data)
    }

    onMounted(() => {
      getNode(0, (data: any) => {
        hasData.value = data.length > 0
      })
    })

    return {
      getNode,
      moveNode,
      removeNode,
      loadNode,
      nodeCheck,
      nodeDrop,
      add,
      edit,
      remove,
      findNodeById,
      handleSubmit,
      allowDrag,
      allowDrop,
      nodeClick,
      treeData,
      defaultProps,
      checkedNode,
      treeLoading,
      rootNode,
      hasData,
      tree
    }
  }
})
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
