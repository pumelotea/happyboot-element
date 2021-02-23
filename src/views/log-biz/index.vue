<template>
  <hb-page-layout>
    <template #actions>
      <el-row :gutter="10">
        <el-col :md="6">
          <hb-form-item-container label="用户名">
            <el-input v-model="tableData.searchCondition.username"></el-input>
          </hb-form-item-container>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="margin-top: 15px">
        <el-col>
          <el-button
            type="primary"
            size="medium"
            @click="pageConditionSearch"
            >查询
          </el-button>
          <el-button type="primary" size="medium" plain @click="handleReset">
            重置
          </el-button>
        </el-col>
      </el-row>
    </template>
    <el-table size="mini" :data="tableData.list" border v-loading="tableData.loading">
      <el-table-column fixed type="index" width="50"> </el-table-column>
      <el-table-column prop="requestMethod" label="请求方法" width="100"></el-table-column>
      <el-table-column prop="requestTime" label="请求时间" width="180"></el-table-column>
      <el-table-column prop="requestIp" label="IP地址" width="120"></el-table-column>
      <el-table-column prop="description" label="描述" width="80">
      </el-table-column>
      <el-table-column prop="requestArgs" label="请求参数" width="300"></el-table-column>
      <el-table-column prop="requestUri" label="请求完整URL" width="300"></el-table-column>
<!--      <el-table-column prop="responseArgs" label="响应内容" width="300">-->
<!--      </el-table-column>-->
      <el-table-column prop="costTime" label="耗时/ms" width="100">
      </el-table-column>
    </el-table>
    <template #pagination>
      <el-pagination
        :page-size="tableData.searchCondition.pageSize"
        :page-sizes="[20, 50, 100]"
        @size-change="pageSizeChange"
        @current-change="pageNoChange"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total"
      >
      </el-pagination>
    </template>
  </hb-page-layout>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import { self } from '@/common'
import { createPage } from '@/common/page'

export default defineComponent ({
  name: 'index',
  setup() {
    const context = self()

    const {
      pageData: tableData,
      pageNoChange,
      pageSizeChange,
      pageConditionSearch,
      defaultPageReset: handleReset,
    } = createPage({
      conditions: {
        username: {
          default:'',
          reset: ''
        },
        type: {
          default:'biz',
          reset: 'biz'
        }
      },
      dataAPI: context.$api.logPage
    })

    return {
      pageNoChange,
      pageSizeChange,
      handleReset,
      pageConditionSearch,
      tableData,
    }
  }
})
</script>
