<template>
  <hb-page-layout id="page_facility_group">
    <template #actions>
      <el-row :gutter="10">
        <el-col :md="6">
          <hb-form-item-container :label="'功能组名称'">
            <el-input
              v-model="tableData.searchCondition.facilityGroupName"
            ></el-input>
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
          >
            新增
          </el-button>
          <el-button
            type="primary"
            size="medium"
            @click="pageConditionSearch"
          >
            查询
          </el-button>
          <el-button type="primary" size="medium" plain @click="handleReset">
            重置
          </el-button>
          <el-button
            permission-key="delete"
            type="danger"
            size="medium"
            @click="handleMultiDelete"
            v-show="tableData.selectedRow.length > 0"
          >
            批量删除
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
      <el-table-column prop="facilityGroupName" align="center" label="功能名称">
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template #default="scope">
          <el-button
            permission-key="link"
            @click="handleLink(scope.row)"
            type="text"
            >关联</el-button
          >
          <el-button
            permission-key="edit"
            @click="handleEdit(scope.row)"
            type="text"
            >编辑</el-button
          >
          <el-button
            permission-key="delete"
            @click="handleDelete(scope.row)"
            type="text"
            style="color: red"
            >删除</el-button
          >
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
    <group-drawer ref="GD" @ok="handleSearch" />
    <point-link-drawer ref="PD" />
  </hb-page-layout>
</template>

<script lang='ts'>
import GroupDrawer from '@/views/facility/facility-group/drawer/GroupDrawer.vue'
import PointLinkDrawer from "@/views/facility/facility-group/drawer/PointLinkDrawer.vue";
import { defineComponent, ref } from 'vue'
import { self } from '@/common'
import { createPage } from '@/common/page'
import { drawerLoader } from '@/common/drawer'

export default defineComponent ({
  name: 'index',
  components: {
    GroupDrawer,
    PointLinkDrawer
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
        facilityGroupName: {
          default:'',
          reset: ''
        },
      },
      dataAPI: context.$api.facilityGroupPage,
      deleteAPI: context.$api.facilityGroupDelete
    })

    const groupDrawerDeploy: any = ref({})

    const handleAdd = () => {
      groupDrawerDeploy.value.title = '新增'
      groupDrawerDeploy.value.haveSubmit = true
      groupDrawerDeploy.value.disabled = false
      groupDrawerDeploy.value.mode = 'add'
      drawer('GD').open(groupDrawerDeploy.value, '')
    }

    const handleEdit = (row: any) => {
      groupDrawerDeploy.value.title = '编辑'
      groupDrawerDeploy.value.haveSubmit = true
      groupDrawerDeploy.value.disabled = false
      groupDrawerDeploy.value.mode = 'edit'
      drawer('GD').open(groupDrawerDeploy.value, row)
    }

    const handleLink = (row: any) => {
      drawer('PD').open(row.id)
    }

    return {
      pageSizeChange,
      handleSearch,
      handleAdd,
      handleEdit,
      handleLink,
      handleDelete,
      handleMultiDelete,
      handleReset,
      pageNoChange,
      rowSelected,
      pageConditionSearch,
      tableData,
      groupDrawerDeploy,
    }
  }
})
</script>

<style scoped></style>
