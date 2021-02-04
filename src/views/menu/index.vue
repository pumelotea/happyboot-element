<template>
  <page-layout>
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
          v-if="treeData.length>0"
          id="__menu-content"
          v-loading="treeLoading"
          :data="treeData"
          :props="defaultProps"
          @node-drop="nodeDrop"
          @check-change="nodeCheck"
          @node-click="nodeClick"
          :allow-drop="allowDrop"
          :allow-drag="allowDrag"
          node-key="id"
          ref="tree"
          draggable
        >
          <template #default="{ node, data }">
            <div class="custom-tree-node">
            <div>
              <i :class="node.data.icon" style="margin-right: 5px"></i>
              <el-button
                plain
                size="small"
                v-if="node.data.type === 'button'"
                >{{ node.label }}</el-button
              >
              <span v-else>{{ node.label }}</span>
            </div>
            <span>
              <el-button
                v-if="node.data.type === 'menu'"
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
          </div>
          </template>
        </el-tree>
        <no-data v-else/>
      </el-col>
      <el-col :span="12">
        <detail ref="MD" />
      </el-col>
    </el-row>
    <form-drawer ref="FD" @handleSubmit="updateNode" />
  </page-layout>
</template>

<script lang='ts'>
import { defineComponent, onMounted, ref } from 'vue'
import { self } from '@/common'
import FormDrawer from './drawer/FormDrawer.vue'
import Detail from './detail/index.vue'
export default defineComponent ({
  name: 'index',
  components: {
    FormDrawer,
    Detail
  },
  setup() {
    const context = self()

    const tree: any = ref(null)
    const MD: any = ref(null)
    const FD: any = ref(null)

    const treeData: any = ref([])
    const treeLoading = ref(false)
    const hasData = ref(false)
    const defaultProps = ref({ label: 'name', id: 'id' })
    const checkedNode: any = ref({})
    const rootNode: any = ref({ node: {}, resolve: null })

    //接口请求树节点
    const getTreeArr = async () => {
      const res: any = await context.$api.getMenuTree()
      if (res.code === 0) {
        treeData.value = res.data
      }
    }

    //接口删除节点
    const removeNode = async (id: any, done: any) => {
      const res: any = await context.$api.deleteMenuTree(id)
      if (res.code === 0) {
        context.$notify({
          title: '成功',
          message: res.msg,
          type: 'success'
        })
        done()
      } else {
        context.$notify({
          title: '失败',
          message: res.msg,
          type: 'error'
        })
      }
      endLoading()
    }

    //移动节点
    const moveNode = async (node: any) => {
      const res: any = await context.$api.modifyMenuNode(node)
      if (res.code !== 0) {
        context.$notify({
          title: '失败',
          message: res.msg,
          type: 'error'
        })
      }
      endLoading()
    }

    const loadTree = () => {
      beginLoading()
      getTreeArr()
      endLoading()
    }

    const nodeCheck = (node: any, checked: any) => {
      if (checked) {
        (tree.value as any).setCheckedNodes([node])
      }
      checkedNode.value = (tree.value as any).getCheckedNodes()[0] || {}
    }

    const add = (data: any) => {
      let newNode: any = {}
      //不直接用data.hasOwnProperty('id')是为了代码规范
      if (Object.prototype.hasOwnProperty.call(data, 'id')) {
        newNode = { parentId: data.id }
      }
      (FD.value as any).add(newNode)
    }

    const edit = (data: any) => {
      (FD.value as any).edit(data)
    }

    const remove = (node: any, data: any) => {
      context.$confirm('即将删除该条数据, 是否确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        beginLoading()
        removeNode(data.id, () => {
          removeNodeOnTree(node, data)
        })
      })
    }

    //更新节点数据(与接口无关)
    const updateNode = (data: any) => {
      if (data.id) {
        const node: any = (tree.value as any).getNode(data.id)
        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(node.data, key)) {
            node.data[key] = data[key]
          }
        }
      } else {
        loadTree()
      }
    }

    //删除树上的节点(与接口无关)
    const removeNodeOnTree = (node: any, data: any) => {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex((d: any) => d.id === data.id)
      children.splice(index, 1)
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
      moveNode(nodeData)
    }

    //能否被拖拽
    const allowDrag = (node: any) => {
      return node.data.type === 'menu';

    }

    //判断是否可以放置节点（不允许同级拖拽）
    const allowDrop = (draggingNode: any, dropNode: any, dropType: any) => {
      if (dropType === 'prev' || dropType === 'next') {
        if (draggingNode.data.parentId === dropNode.data.parentId) {
          return false
        }
      }
      return true
    }

    const beginLoading = () => {
      treeLoading.value = true
    }

    const endLoading = () => {
      treeLoading.value = false
    }

    //点击事件
    const nodeClick = (data: any) => {
      (MD.value as any).open(data)
    }

    onMounted(() => {
      loadTree()
    })

    return {
      loadTree,
      removeNode,
      moveNode,
      nodeCheck,
      add,
      edit,
      remove,
      updateNode,
      removeNodeOnTree,
      nodeDrop,
      allowDrag,
      allowDrop,
      beginLoading,
      endLoading,
      getTreeArr,
      nodeClick,
      treeData,
      treeLoading,
      hasData,
      defaultProps,
      checkedNode,
      rootNode,
      MD,
      FD,
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
<style>
#__menu-content .el-tree-node__content {
  height: 40px;
}
</style>
