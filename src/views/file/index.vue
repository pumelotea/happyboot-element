<template>
  <page-layout>
    <template #actions>
      <el-row :gutter="10">
        <el-col :md="6">
          <form-item-container :label="'文件名称'">
            <el-input
              v-model="tableData.searchQuery.fileName"
              placeholder="请输入文件名称"
            />
          </form-item-container>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="margin-top: 15px">
        <el-col>
          <el-button type="primary" size="medium" @click="handleSearch"
          >查询
          </el-button
          >
          <el-button type="primary" size="medium" plain @click="handleReset"
          >重置
          </el-button
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
      <el-table-column prop="fileName" align="center" label="文件名称" />
      <el-table-column
        prop="filePath"
        align="center"
        label="文件路径"
        width="200"
      />
      <el-table-column
        prop="mime"
        align="center"
        label="文件类型"
        width="120"
      />
      <el-table-column
        prop="fileSize"
        align="center"
        label="文件大小"
        width="120"
      />
      <el-table-column
        prop="createUserName"
        align="center"
        label="上传人"
        width="120"
      />
      <el-table-column
        prop="createTime"
        align="center"
        label="上传时间"
        width="150"
      />
      <el-table-column fixed="right" align="center" label="操作" width="120">
        <template #default="scope">
          <a
            style="margin-right: 10px;"
            @click="download(scope.row)"
          >
            <el-button type="text" permission-key="download"
            >下载
            </el-button
            >
          </a>
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
  </page-layout>
</template>
<script lang='ts'>
import { defineComponent, onMounted, ref } from 'vue'
import { self } from '@/common'
import { downloadFile } from '@/common/utils'

export default defineComponent({
  name: 'index',
  setup() {
    const context = self()

    const tableData = ref({
      searchQuery: {
        fileName: '',
        pageNo: 1,
        pageSize: 20
      },
      total: 0,
      loading: false,
      list: []
    })
    const tableSelectedData: any = ref([])

    //查询
    const search = async (success: any, error: any) => {
      tableData.value.loading = true
      const res: any = await context.$api.filePage(tableData.value.searchQuery)
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

    //重置
    const handleReset = () => {
      tableData.value.searchQuery.fileName = ''
      tableData.value.searchQuery.pageSize = 20
      tableData.value.searchQuery.pageNo = 1

      handleSearch()
    }

    const download = async (item: any) => {

      try {
        const res = await context.$api.download(item.id)
        downloadFile(res.data,res.headers.file_name)
      } catch (e) {
        context.$notify({
          type: 'error',
          title: '下载失败',
          message: '文件未找到'
        })
      }
    }

    onMounted(() => {
      handleSearch()
    })

    return {
      search,
      pageSizeChange,
      currentClick,
      handleSearch,
      tableSelected,
      handleReset,
      download,
      tableData,
      tableSelectedData
    }
  }
})
</script>
