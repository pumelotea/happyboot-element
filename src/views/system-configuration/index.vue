<template>
  <hb-page-layout>
    <template #actions>
      <el-row :gutter="10">
        <el-col :md="6">
          <hb-form-item-container :label="'参数名'">
            <el-input v-model="tableData.searchCondition.key"></el-input>
          </hb-form-item-container>
        </el-col>
        <el-col :md="6">
          <hb-form-item-container :label="'类型'">
            <el-select
              v-model="tableData.searchCondition.type"
              clearable
              placeholder="请选择类型"
              style="width: 100%"
            >
              <el-option
                v-for="item in dataDict.SYS_CONFIG_TYPE?.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </hb-form-item-container>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="margin-top: 15px">
        <el-col>
          <el-button
            type="primary"
            size="medium"
            @click="handleAdd"
            permission-key="add">
            新增
          </el-button>
          <el-button type="primary" size="medium" @click="pageConditionSearch">
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
            v-show="tableData.selectedRow.length > 0">
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
      <el-table-column prop="key" align="center" label="参数名">
      </el-table-column>
      <el-table-column prop="value" align="center" label="参数值">
      </el-table-column>
      <el-table-column prop="type" align="center" label="类型">
        <template #default="scope">{{ dataDict.SYS_CONFIG_TYPE?.mappings[scope.row.type] }}</template>
      </el-table-column>
      <el-table-column prop="remark" align="center" label="备注">
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template #default="scope">
          <el-button @click="handleDetail(scope.row)" type="text">查看</el-button>
          <el-button @click="handleEdit(scope.row)" type="text">编辑</el-button>
          <el-button permission-key="delete" @click="handleDelete(scope.row)" type="text" style="color: red">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <template #pagination>
      <el-pagination
        :page-sizes="[20, 50, 100]"
        :page-size="tableData.searchCondition.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total"
        @size-change="pageSizeChange"
        @current-change="pageNoChange"
      >
      </el-pagination>
    </template>

    <configuration-drawer ref="CD" @ok="handleSearch" />
  </hb-page-layout>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue'
import { self } from '@/common'
import ConfigurationDrawer from './drawer/ConfigurationDrawer.vue'
import { createPage } from '@/common/page'
import { loadDict } from '@/common/dict'
import { drawerLoader } from '@/common/drawer'

export default defineComponent({
  name: 'index',
  components: {
    ConfigurationDrawer
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
        key: {
          default:'',
          reset: ''
        },
        value: {
          default:'',
          reset: ''
        },
        type: {
          default:'',
          reset: ''
        }
      },
      dataAPI: context.$api.configPage,
      deleteAPI:context.$api.configDelete
    })

    const { dataDict } = loadDict(['SYS_CONFIG_TYPE'])

    let configurationDrawerDeploy: any = {}

    const handleAdd = () => {
      configurationDrawerDeploy.title = '新增'
      configurationDrawerDeploy.haveSubmit = true
      configurationDrawerDeploy.disabled = false
      configurationDrawerDeploy.mode = 'add'
      drawer('CD').open(configurationDrawerDeploy, '')
    }

    const handleEdit = (row: any) => {
      configurationDrawerDeploy.title = '编辑'
      configurationDrawerDeploy.haveSubmit = true
      configurationDrawerDeploy.disabled = false
      configurationDrawerDeploy.mode = 'edit'
      drawer('CD').open(configurationDrawerDeploy, row)
    }

    const handleDetail = (row: any) => {
      configurationDrawerDeploy.title = '详情'
      configurationDrawerDeploy.haveSubmit = false
      configurationDrawerDeploy.disabled = true
      drawer('CD').open(configurationDrawerDeploy, row)
    }

    return {
      pageSizeChange,
      pageNoChange,
      pageConditionSearch,
      handleSearch,
      handleAdd,
      handleEdit,
      handleDetail,
      handleDelete,
      handleMultiDelete,
      handleReset,
      rowSelected,
      tableData,
      dataDict
    }
  }
})
</script>
