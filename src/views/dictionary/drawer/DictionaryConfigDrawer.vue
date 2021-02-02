<template>
  <drawer-layout
    v-model="isShow"
    :title="dictionaryConfigDrawerDeploy.title"
  >
    <el-row :gutter="10" style="margin: 15px 0">
      <el-col :md="6">
        <form-item-container :label="'名称'">
          <el-input v-model="tableData.searchCondition.itemText"></el-input>
        </form-item-container>
      </el-col>
      <el-col :md="6">
        <form-item-container :label="'数据值'">
          <el-input v-model="tableData.searchCondition.itemValue"></el-input>
        </form-item-container>
      </el-col>
    </el-row>
    <el-row :gutter="10" style="margin: 15px 0">
      <el-col>
        <el-button type="primary" size="medium" @click="handleAdd"
          >新增</el-button
        >
        <el-button type="primary" size="medium" @click="handleConditionSearch"
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
      :page-sizes="[20, 50, 100]"
      :page-size="tableData.searchCondition.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableData.total"
      style="margin: 15px 0"
      @size-change="pageSizeChange"
      @current-change="currentClick"
    >
    </el-pagination>
  </drawer-layout>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue'
import { self } from '@/common'

export default defineComponent ({
  name: 'DictionaryConfigDrawer',
  setup(props, { emit }) {
    const context = self()

    const isShow = ref(false)
    const dictionaryConfigDrawerDeploy: any = ref({ title: '字典列表' })
    const tableData: any = ref({
      searchCondition: {
        dictId: '',
        itemText: '',
        itemValue: '',
        pageNo: 1,
        pageSize: 20
      },
      total: 0,
      loading: false,
      list: []
    })

    const pageSizeChange = (val: any) => {
      tableData.value.searchCondition.pageSize = val
      tableData.value.searchCondition.pageNo = 1
      handleSearch()
    }

    const currentClick = (val: any) => {
      tableData.value.searchCondition.pageNo = val
      handleSearch()
    }

    const open = (data: any) => {
      tableData.value.searchCondition.itemText = ''
      tableData.value.searchCondition.itemValue = ''
      tableData.value.searchCondition.pageNo = 1
      tableData.value.searchCondition.pageSize = 20
      tableData.value.searchCondition.dictId = data

      isShow.value = true

      handleSearch()
    }

    const handleConditionSearch = () => {
      tableData.value.searchCondition.pageNo = 1
      handleSearch()
    }

    const handleReset = () => {
      tableData.value.searchCondition.itemText = ''
      tableData.value.searchCondition.itemValue = ''
      tableData.value.searchCondition.pageNo = 1
      tableData.value.searchCondition.pageSize = 20
      handleSearch()
    }

    const handleSearch = async () => {
      tableData.value.loading = true

      const res: any = await context.$api.dictItemPage(tableData.value.searchCondition)
      if (res.code === 0) {
        tableData.value.list = res.data.records
        tableData.value.total = res.data.total
      }

      tableData.value.loading = false
    }

    const handleAdd = () => {
      emit(
        'openConfigItemDrawer',
        'add',
        tableData.value.searchCondition.dictId
      )
    }

    const handleEdit = (row: any) => {
      emit('openConfigItemDrawer', 'edit', row.id)
    }

    const handleDelete = (row: any) => {
      context.$confirm('即将删除该条数据, 是否确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          context.$api.dictItemDelete(row.id).then((res: any) => {
            if (res.code === 0) {
              tableData.value.searchCondition.pageNo = 1
              handleSearch()
              context.$notify({
                type: 'success',
                title: '提示',
                message: '删除成功！'
              })
            } else {
              context.$notify({
                type: 'error',
                title: '提示',
                message: res.msg
              })
            }
          })
        })
    }

    return {
      open,
      currentClick,
      pageSizeChange,
      handleConditionSearch,
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
