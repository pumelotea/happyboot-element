<template>
  <hb-page-layout>
    <template #actions>
      <el-row :gutter="10">
        <el-col :md="6">
          <hb-form-item-container :label="'文件版本号'">
            <el-input
              v-model="tableData.searchCondition.blobVersion"
              placeholder="请输入文件版本号"
            />
          </hb-form-item-container>
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
          >批量删除</el-button
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
            style="margin-right: 10px;"
            @click="download(scope.row)"
          >
            <el-button type="text" permission-key="download"
            >下载
            </el-button
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
        :page-size="tableData.searchCondition.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total"
        @size-change="pageSizeChange"
        @current-change="pageNoChange"
      />
    </template>
    <form-drawer ref="FD" @handleSubmit="handleSearch" />
  </hb-page-layout>
</template>
<script lang='ts'>
import { self } from '@/common'
import FormDrawer from './drawer/FormDrawer.vue'
import { defineComponent, ref } from 'vue'
import { downloadFile } from '@/common/utils'
import { createPage } from '@/common/page'
import { drawerLoader } from '@/common/drawer'
export default defineComponent ({
  name: 'index',
  components: {
    FormDrawer
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
        blobVersion: {
          default:'',
          reset: ''
        },
      },
      dataAPI: context.$api.getApp,
      deleteAPI: context.$api.deleteApp
    })

    const inspectionTypeOptions: any = ref({})
    const dataScopeOptions: any = ref({})

    const handleAdd = () => {
      drawer('FD').add()
    }

    const download = async (item: any) => {
      try {
        const res: any = await context.$api.download(item.blobUrl)
        downloadFile(res.data,res.headers.file_name)
      } catch (e) {
        context.$notify({
          type: 'error',
          title: '下载失败',
          message: '文件未找到'
        })
      }
    }

    const fileId2Url = (data: any) => {
      return context.$api.$fileId2Url(data)
    }

    return {
      pageSizeChange,
      handleSearch,
      handleAdd,
      handleDelete,
      handleMultiDelete,
      handleReset,
      fileId2Url,
      download,
      pageNoChange,
      rowSelected,
      pageConditionSearch,
      tableData,
      inspectionTypeOptions,
      dataScopeOptions,
    }
  }
})
</script>
