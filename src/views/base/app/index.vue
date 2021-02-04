<template>
  <page-layout>
    <template #actions>
      <el-row :gutter="10">
        <el-col :md="6">
          <form-item-container :label="'文件版本号'">
            <el-input
              v-model="tableData.searchQuery.blobVersion"
              placeholder="请输入文件版本号"
            />
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
      <el-table-column prop="updateContent" align="center" label="更新内容" />
      <el-table-column
        prop="blobVersion"
        align="center"
        label="版本"
        width="70"
      />
      <el-table-column
        prop="createUserName"
        align="center"
        label="上传人"
        width="110"
      />
      <el-table-column
        prop="createTime"
        align="center"
        label="上传时间"
        width="160"
      />
      <el-table-column fixed="right" align="center" label="操作" width="120">
        <template #default="scope">
          <a
            :href="fileId2Url(scope.row.blobUrl)"
            style="margin-right: 10px;"
            target="_blank"
            download
          >
            <el-button type="text" permission-key="download"
            >下载</el-button
            >
          </a>
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
  </page-layout>
</template>
<script lang='ts'>
import { self } from '@/common'
import FormDrawer from './drawer/FormDrawer.vue'
import { defineComponent, onMounted, ref } from 'vue'
export default defineComponent ({
  name: 'index',
  components: {
    FormDrawer
  },
  setup() {
    const context = self()

    const FD: any = ref(null)

    const tableData = ref({
      searchQuery: {
        blobVersion: '',
        pageNo: 1,
        pageSize: 20
      },
      total: 0,
      loading: false,
      list: []
    })
    const inspectionTypeOptions: any = ref({})
    const dataScopeOptions: any = ref({})
    const tableSelectedData:any = ref([])

    //查询
    const search = async (success: any, error: any) => {
      tableData.value.loading = true
      const res: any = await context.$api.getApp(tableData.value.searchQuery)
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
      const res: any = await context.$api.deleteApp(id)
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

    // 单删
    const handleDelete = (row: any) => {
      const msg = '即将删除该条数据, 是否确认?'
      const ids = row.updateId
      implementDelete(ids, msg)
    }

    // 多删
    const handleMultiDelete = () => {
      const msg =
        '即将删除这' + tableSelectedData.value.length + '条数据, 是否确认?'
      let ids = ''
      tableSelectedData.value.forEach((item: any) => {
        ids = ids + ',' + item.updateId
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
      tableData.value.searchQuery.blobVersion = ''
      tableData.value.searchQuery.pageNo = 1
      tableData.value.searchQuery.pageSize = 20

      handleSearch()
    }

    const fileId2Url = (data: any) => {
      return context.$api.$fileId2Url(data)
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
      handleDelete,
      handleMultiDelete,
      implementDelete,
      handleReset,
      fileId2Url,
      tableData,
      inspectionTypeOptions,
      dataScopeOptions,
      tableSelectedData,
      FD
    }
  }
})
</script>
