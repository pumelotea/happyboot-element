<template>
  <hb-page-layout>
    <template #actions>
      <el-row :gutter="10">
        <el-col :md="6">
          <hb-form-item-container :label="'角色名称'">
            <el-input v-model="tableData.searchCondition.roleName"></el-input>
          </hb-form-item-container>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="margin-top: 15px">
        <el-col>
          <el-button
            type="primary"
            size="medium"
            @click="handleAdd"
            permission-key="add"
            >新增</el-button
          >
          <el-button type="primary" size="medium" @click="pageConditionSearch"
            >查询</el-button
          >
          <el-button type="primary" size="medium" plain @click="handleReset"
            >重置</el-button
          >
          <el-button
            permission-key="delete"
            type="danger"
            size="medium"
            @click="handleMultiDelete"
            v-show="tableData.selectedRow.length > 0"
            >批量删除
          </el-button>
        </el-col>
      </el-row>
    </template>
    <el-table
      size="mini"
      :data="tableData.list"
      @selection-change="rowSelected"
      border
      v-loading="tableData.loading"
      style="width: 100%"
    >
      <el-table-column type="selection" align="center" width="50">
      </el-table-column>
      <!--      <el-table-column fixed prop="authorityName" align="center" label="角色编码"> </el-table-column>-->
      <el-table-column prop="roleName" align="center" label="角色名称">
      </el-table-column>
      <el-table-column prop="status" align="center" label="状态" width="60">
        <template #default="scope">
          <span style="color: #e4979b" v-if="scope.row.status === 0">禁用</span>
          <span style="color: #8290ff" v-if="scope.row.status === 1">启用</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template #default="scope">
          <el-button @click="handlePermissionLink(scope.row)" type="text"
            >权限</el-button
          >
          <el-button @click="handleEdit(scope.row)" type="text">编辑</el-button>
          <el-dropdown>
            <el-button class="el-dropdown-link" type="text"
              >更多<em class="el-icon-arrow-down el-icon--right"
            /></el-button>
            <template #dropdown>
              <el-dropdown-menu>
              <el-dropdown-item>
                <el-button
                  permission-key="delete"
                  @click="handleDelete(scope.row)"
                  type="text"
                  style="color: red"
                  >删除</el-button
                >
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button @click="handleDetail(scope.row)" type="text"
                  >查看</el-button
                >
              </el-dropdown-item>
            </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <template #pagination>
      <el-pagination
        background
        :page-sizes="[20, 50, 100]"
        :page-size="tableData.searchCondition.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total"
        @size-change="pageSizeChange"
        @current-change="pageNoChange"
      >
      </el-pagination>
    </template>

    <role-info-drawer ref="RID" @ok="handleSearch()" />
    <permission-link-drawer ref="PLD" />
  </hb-page-layout>
</template>

<script lang='ts'>
import RoleInfoDrawer from './drawer/RoleInfoDrawer.vue'
import PermissionLinkDrawer from './drawer/PermissionLinkDrawer.vue'
import { defineComponent, ref } from 'vue'
import { self } from '@/common'
import { createPage } from '@/common/page'
import { drawerLoader } from '@/common/drawer'
export default defineComponent ({
  name: 'index',
  components: {
    RoleInfoDrawer,
    PermissionLinkDrawer
  },
  setup() {
    const context = self()
    const drawer = drawerLoader()

    const {
      pageData: tableData,
      defaultDataLoader: handleSearch,
      pageNoChange,
      pageSizeChange,
      rowSelected,
      pageConditionSearch,
      defaultPageReset: handleReset,
      defaultDeleteHandle:handleDelete,
      defaultMultiDeleteHandle:handleMultiDelete
    } = createPage({
      conditions: {
        roleName: {
          default:'',
          reset: ''
        },
        authorityName: {
          default:'',
          reset: ''
        },
      },
      dataAPI: context.$api.rolePage,
      deleteAPI: context.$api.roleDelete
    })

    const roleInfoDrawerDeploy: any = ref({})
    const permissionLinkDrawerDeploy: any = ref({})

    const handleAdd = () => {
      roleInfoDrawerDeploy.value.title = '新增'
      roleInfoDrawerDeploy.value.haveSubmit = true
      roleInfoDrawerDeploy.value.disabled = false
      roleInfoDrawerDeploy.value.mode = 'add'
      drawer('RID').open(roleInfoDrawerDeploy.value, '')
    }

    const handleEdit = (row: any) => {
      roleInfoDrawerDeploy.value.title = '编辑'
      roleInfoDrawerDeploy.value.haveSubmit = true
      roleInfoDrawerDeploy.value.disabled = false
      roleInfoDrawerDeploy.value.mode = 'edit'
      drawer('RID').open(roleInfoDrawerDeploy.value, row)
    }

    const handleDetail = (row: any) => {
      roleInfoDrawerDeploy.value.title = '详情'
      roleInfoDrawerDeploy.value.haveSubmit = false
      roleInfoDrawerDeploy.value.disabled = true
      drawer('RID').open(roleInfoDrawerDeploy.value, row)
    }

    const handlePermissionLink = (row: any) => {
      drawer('PLD').open(row)
    }

    return {
      pageSizeChange,
      pageNoChange,
      handleAdd,
      handleReset,
      handleMultiDelete,
      handleDelete,
      handlePermissionLink,
      handleDetail,
      handleEdit,
      handleSearch,
      rowSelected,
      pageConditionSearch,
      permissionLinkDrawerDeploy,
      roleInfoDrawerDeploy,
      tableData
    }
  }
})
</script>

<style scoped>
.el-dropdown-link {
  cursor: pointer;
  margin-left: 10px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
