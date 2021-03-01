<template>
  <hb-page-layout>
    <template #actions>
      <el-row :gutter="10">
        <el-col :md="6">
          <hb-form-item-container :label="'主体名称'">
            <el-input v-model="tableData.searchCondition.subjectName" />
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
      <el-table-column prop="subjectName" align="center" label="主体名称">
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="180">
        <template #default="scope">
          <el-button
            @click="handleRegionLink(scope.row)"
            type="text"
            permission-key="regionLink"
            >区域关联</el-button
          >
          <el-button @click="handleEdit(scope.row)" type="text">编辑</el-button>
          <el-dropdown>
            <el-button class="el-dropdown-link" type="text">更多<em class="el-icon-arrow-down el-icon--right" /></el-button>
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

    <subject-drawer ref="SD" @ok="handleSearch" />
    <region-link-drawer ref="RLD" />
  </hb-page-layout>
</template>

<script lang='ts'>
import SubjectDrawer from './drawer/SubjectDrawer.vue'
import RegionLinkDrawer from './drawer/RegionLinkDrawer.vue'
import { defineComponent, ref } from 'vue'
import { self } from '@/common'
import { createPage } from '@/common/page'
import { drawerLoader } from '@/common/drawer'
export default defineComponent ({
  name: 'index',
  components: {
    SubjectDrawer,
    RegionLinkDrawer
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
        subjectName:{
          default:'',
          reset: ''
        }
      },
      dataAPI: context.$api.subjectPage,
      deleteAPI: context.$api.subjectDelete
    })

    const subjectDrawerDeploy: any = ref({})
    const regionLinkDrawerDeploy: any = ref({})

    const handleAdd = () => {
      subjectDrawerDeploy.value.title = '新增'
      subjectDrawerDeploy.value.haveSubmit = true
      subjectDrawerDeploy.value.disabled = false
      subjectDrawerDeploy.value.mode = 'add'
      drawer('SD').open(subjectDrawerDeploy.value, '')
    }

    const handleEdit = (row: any) => {
      subjectDrawerDeploy.value.title = '编辑'
      subjectDrawerDeploy.value.haveSubmit = true
      subjectDrawerDeploy.value.disabled = false
      subjectDrawerDeploy.value.mode = 'edit'
      drawer('SD').open(subjectDrawerDeploy.value, row)
    }

    const handleDetail = (row: any) => {
      subjectDrawerDeploy.value.title = '详情'
      subjectDrawerDeploy.value.haveSubmit = false
      subjectDrawerDeploy.value.disabled = true
      drawer('SD').open(subjectDrawerDeploy.value, row)
    }

    const handleRegionLink = (row: any) => {
      drawer('RLD').open(row)
    }

    return {
      pageNoChange,
      pageSizeChange,
      handleSearch,
      handleAdd,
      handleEdit,
      handleRegionLink,
      handleDelete,
      handleDetail,
      handleMultiDelete,
      handleReset,
      pageConditionSearch,
      rowSelected,
      tableData,
      subjectDrawerDeploy,
      regionLinkDrawerDeploy,
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
