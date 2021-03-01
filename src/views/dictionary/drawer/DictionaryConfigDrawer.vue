<template>
  <hb-drawer-layout
    v-model="isShow"
    :title="dictionaryConfigDrawerDeploy.title"
  >
    <el-row :gutter="10" style="margin: 15px 0">
      <el-col :md="6">
        <hb-form-item-container :label="'名称'">
          <el-input v-model="tableData.searchCondition.itemText"></el-input>
        </hb-form-item-container>
      </el-col>
      <el-col :md="6">
        <hb-form-item-container :label="'数据值'">
          <el-input v-model="tableData.searchCondition.itemValue"></el-input>
        </hb-form-item-container>
      </el-col>
    </el-row>
    <el-row :gutter="10" style="margin: 15px 0">
      <el-col>
        <el-button type="primary" size="medium" @click="handleAdd"
          >新增</el-button
        >
        <el-button type="primary" size="medium" @click="pageConditionSearch"
          >查询</el-button
        >
        <el-button type="primary" size="medium" plain @click="handleReset"
          >重置</el-button
        >
      </el-col>
    </el-row>
    <el-table size="mini" :data="tableData.list" border style="width: 100%">
      <el-table-column prop="itemText" align="center" label="名称" />
      <el-table-column prop="itemValue" align="center" label="数据值" />
      <el-table-column fixed="right" align="center" label="操作" width="130">
        <template #default="scope">
          <el-button @click="handleEdit(scope.row)" type="text">编辑</el-button>
          <el-button
            @click="handleDelete(scope.row)"
            type="text"
            style="color: red"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :page-sizes="[20, 50, 100]"
      :page-size="tableData.searchCondition.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableData.total"
      style="margin: 15px 0"
      @size-change="pageSizeChange"
      @current-change="pageNoChange"
    >
    </el-pagination>
  </hb-drawer-layout>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue'
import { self } from '@/common'
import { createPage } from '@/common/page'

export default defineComponent ({
  name: 'DictionaryConfigDrawer',
  setup(props, { emit }) {
    const context = self()

    const isShow = ref(false)
    const dictionaryConfigDrawerDeploy: any = ref({ title: '字典列表' })
    const {
      pageData: tableData,
      defaultDataLoader: handleSearch,
      pageSizeChange,
      pageNoChange,
      pageConditionSearch,
      pageReset,
      defaultDeleteHandle: handleDelete,
    } = createPage({
      conditions: {
        dictId: {
          default: '',
          reset: ''
        },
        itemText: {
          default: '',
          reset: ''
        },
        itemValue: {
          default: '',
          reset: ''
        },
      },
      dataAPI: context.$api.dictItemPage,
      deleteAPI: context.$api.dictItemDelete
    })


    const open = (data: any) => {
      tableData.searchCondition.itemText = ''
      tableData.searchCondition.itemValue = ''
      tableData.searchCondition.pageNo = 1
      tableData.searchCondition.pageSize = 20
      tableData.searchCondition.dictId = data
      isShow.value = true
      handleSearch()
    }

    const handleAdd = () => {
      emit(
        'openConfigItemDrawer',
        'add',
        tableData.searchCondition.dictId
      )
    }

    const handleEdit = (row: any) => {
      emit('openConfigItemDrawer', 'edit', row.id)
    }

    const handleReset = ()=>{
      pageReset({
        itemText:'',
        itemValue:''
      })
    }

    return {
      open,
      pageSizeChange,
      pageNoChange,
      pageConditionSearch,
      handleReset,
      handleAdd,
      handleEdit,
      handleDelete,
      handleSearch,
      isShow,
      dictionaryConfigDrawerDeploy,
      tableData
    }
  }
})
</script>
