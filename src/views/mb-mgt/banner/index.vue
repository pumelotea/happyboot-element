<template>
  <page-layout>
    <template #actions>
      <el-row :gutter="10">
        <el-col :md="6">
          <form-item-container :label="'是否启用'">
            <el-select
              v-model="tableData.searchQuery.enable"
              clearable
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="(item, key) in isEnableOptions"
                :key="key"
                :label="item"
                :value="key"
              />
            </el-select>
          </form-item-container>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="margin-top: 15px">
        <el-col>
          <el-button
            type="primary"
            permission-key="add"
            size="medium"
            @click="handleAdd"
            >新增</el-button
          >
          <el-button type="primary" size="medium" @click="handleSearch"
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
            v-show="tableSelectedData.length > 0"
            >批量删除</el-button
          >
        </el-col>
      </el-row>
    </template>
    <el-table
      size="mini"
      :data="tableData.list"
      @selection-change="tableSelected"
      border
      v-loading="tableData.loading"
      style="width: 100%"
    >
      <el-table-column type="selection" align="center" width="50" />
      <el-table-column type="index" align="center" width="50" label="#" />
      <el-table-column prop="linkUrl" align="center" label="url地址" />
      <el-table-column prop="des" align="center" label="描述" />
      <el-table-column prop="enable" align="center" label="是否启用" width="50">
        <template #default="scope">{{
          isEnableOptions[scope.row.enable]
        }}</template>
      </el-table-column>
      <el-table-column
        prop="sortOrder"
        align="center"
        label="排序"
        width="80"
      />
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template #default="scope">
          <el-button @click="handleDetail(scope.row)" type="text"
            >查看</el-button
          >
          <el-button
            @click="handleEdit(scope.row)"
            type="text"
            permission-key="edit"
            >编辑</el-button
          >
          <el-button
            @click="handleDelete(scope.row)"
            type="text"
            permission-key="delete"
            style="color: red"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <template #pagination>
      <el-pagination
        :page-sizes="[20, 50, 100]"
        :page-size="tableData.searchQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total"
        @size-change="pageSizeChange"
        @current-change="currentClick"
      />
    </template>
    <form-drawer ref="FD" @handleSubmit="handleSearch" />
    <detail-drawer ref="DD" />
  </page-layout>
</template>
<script lang='ts'>
import FormDrawer from './drawer/FormDrawer.vue'
import DetailDrawer from './drawer/DetailDrawer.vue'
import { defineComponent, onMounted, ref } from 'vue'
import { self } from '@/common'

export default defineComponent ({
  name: 'index',
  components: {
    FormDrawer,
    DetailDrawer
  },
  setup() {
    const context = self()

    const FD: any = ref(null)
    const DD: any = ref(null)

    const tableData = ref({
      searchQuery: {
        enable: '',
        pageNo: 1,
        pageSize: 20
      },
      total: 0,
      loading: false,
      list: []
    })
    const isEnableOptions = { 0: '否', 1: '是' }
    const tableSelectedData: any = ref([])

    //查询
    const search = async (success: any, error: any) => {
      tableData.value.loading = true
      const res: any = await context.$api.getBanner(tableData.value.searchQuery)
      if (res.code === 0) {
        success(res)
      } else {
        error(res)
      }
      tableData.value.loading = false
    }

    // 删除 可批量删除，id用,隔开
    const doDelete = async (id: any, success: any, error: any) => {
      tableData.value.loading = true
      const res: any = await context.$api.deleteBanner(id)
      if (res.code === 0) {
        success(res)
      } else {
        error(res)
      }
      tableData.value.loading = false
    }

    const pageSizeChange = (val: any) => {
      tableData.value.searchQuery.pageSize = val
      tableData.value.searchQuery.pageNo = 1
      handleSearch()
    }

    const currentClick = (val: any) => {
      tableData.value.searchQuery.pageNo = val
      handleSearch()
    }

    const handleSearch = () => {
      search(
          (res: any) => {
            tableData.value.list = res.data.records
            tableData.value.total = Number(res.data.total)
          },
          (err: any) => {
            context.$notify({
              type: 'error',
              title: '提示',
              message: err.msg
            })
          }
      )
    }

    const tableSelected = (rows: any) => {
      tableSelectedData.value = rows
    }

    const handleAdd = () => {
      (FD.value as any).add()
    }

    const handleEdit = (row: any) => {
      (FD.value as any).edit({ id: row.id })
    }

    const handleDetail = (row: any) => {
      (DD.value as any).detail({ id: row.id })
    }

    // 单删
    const handleDelete = (row: any) => {
      const msg = '即将删除该条数据, 是否确认?'
      const ids = row.id
      implementDelete(ids, msg)
    }

    // 多删
    const handleMultiDelete = () => {
      const msg =
          '即将删除这' + tableSelectedData.value.length + '条数据, 是否确认?'
      let ids = ''
      tableSelectedData.value.forEach((item: any) => {
        ids = ids + ',' + item.id
      })
      implementDelete(ids, msg)
    }

    // 执行删除
    const implementDelete = (ids: any, msg: any) => {
      context.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(() => {
            doDelete(
                ids,
                () => {
                  tableData.value.searchQuery.pageNo = 1
                  handleSearch()
                  context.$notify({
                    type: 'success',
                    title: '提示',
                    message: '删除成功！'
                  })
                },
                (err: any) => {
                  context.$notify({
                    type: 'error',
                    title: '提示',
                    message: err.msg
                  })
                }
            )
          })
    }

    //重置
    const handleReset = () => {
      tableData.value.searchQuery.enable = ''
      tableData.value.searchQuery.pageNo = 1
      tableData.value.searchQuery.pageSize = 20
      handleSearch()
    }

    onMounted(() => {
      handleSearch()
    })

    return {
      search,
      doDelete,
      pageSizeChange,
      currentClick,
      handleSearch,
      tableSelected,
      handleAdd,
      handleEdit,
      handleDetail,
      handleDelete,
      handleMultiDelete,
      implementDelete,
      handleReset,
      tableData,
      isEnableOptions,
      tableSelectedData,
      FD,
      DD
    }
  }
})
</script>
