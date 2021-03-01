<template>
  <hb-page-layout>
    <template #actions>
      <el-row :gutter="10">
        <el-col :md="6">
          <hb-form-item-container :label="'文件名称'">
            <el-input
              v-model="tableData.searchCondition.fileName"
              placeholder="请输入文件名称"
            />
          </hb-form-item-container>
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
      @selection-change="rowSelected"
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
        background
        :page-sizes="[20, 50, 100]"
        :page-size="tableData.searchCondition.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total"
        @size-change="pageSizeChange"
        @current-change="pageNoChange"
      />
    </template>
  </hb-page-layout>
</template>
<script lang='ts'>
import { defineComponent } from 'vue'
import { self } from '@/common'
import { downloadFile } from '@/common/utils'
import { createPage } from '@/common/page'

export default defineComponent({
  name: 'index',
  setup() {
    const context = self()

    const {
      pageData: tableData,
      defaultDataLoader: handleSearch,
      pageSizeChange,
      pageNoChange,
      rowSelected,
      pageConditionSearch,
      defaultPageReset: handleReset
    } = createPage({
      conditions: {
        fileName: {
          default:'',
          reset: ''
        },
      },
      dataAPI: context.$api.filePage
    })

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

    return {
      pageSizeChange,
      handleSearch,
      handleReset,
      download,
      pageNoChange,
      pageConditionSearch,
      rowSelected,
      tableData,
    }
  }
})
</script>
