<template>
  <hb-page-layout>
    <template #actions>
      <el-row :gutter="10">
        <el-col :md="6">
          <hb-form-item-container label="用户名">
            <el-input v-model="tableData.account"></el-input>
          </hb-form-item-container>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="margin-top: 15px">
        <el-col>
          <el-button
            type="primary"
            size="medium"
            @click="
              () => {
                tableData.page = 1
                getPage()
              }
            "
            >查询
          </el-button>
          <el-button type="primary" size="medium" plain @click="reset">
            重置
          </el-button>
        </el-col>
      </el-row>
    </template>
    <el-table size="mini" :data="tableData.list" border v-loading="tableData.loading">
      <el-table-column fixed type="index" width="50"> </el-table-column>
      <el-table-column prop="createTime" label="操作时间" width="180">
      </el-table-column>
      <el-table-column prop="ip" label="IP地址" width="120"></el-table-column>
      <el-table-column prop="requestType" label="请求方法" width="80">
      </el-table-column>
      <el-table-column
        prop="requestParam"
        label="请求参数"
        width="300"
      ></el-table-column>
      <el-table-column prop="method" label="代码方法" width="300">
      </el-table-column>
      <el-table-column prop="requestUrl" label="请求完整URL" width="300">
      </el-table-column>
      <el-table-column prop="costTime" label="耗时/ms" width="100">
      </el-table-column>
    </el-table>
    <template #pagination>
      <el-pagination
        :current-page="tableData.page"
        :page-sizes="[20, 50, 100]"
        :page-size="tableData.pageSize"
        @size-change="
          e => {
            tableData.pageSize = e
            tableData.page = 1
            getPage()
          }
        "
        @current-change="
          e => {
            tableData.page = e
            getPage()
          }
        "
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.totalPage"
      >
      </el-pagination>
    </template>
  </hb-page-layout>
</template>

<script lang='ts'>
import { defineComponent, onMounted, ref } from 'vue'
import { self } from '@/common'

export default defineComponent ({
  name: 'index',
  setup() {
    const context = self()

    const tableData = ref({
      account: '',
      loading: false,
      page: 1,
      pageSize: 20,
      totalPage: 0,
      list: []
    })

    const reset = () => {
      tableData.value.account = ''
      tableData.value.loading = false
      tableData.value.page = 1
      getPage()
    }

    const getPage = async () => {
      tableData.value.loading = true

      const res: any = await context.$api.logPage({
        account: tableData.value.account,
        pageNo: tableData.value.page,
        pageSize: tableData.value.pageSize
      })

      if (res.code === 0) {
        tableData.value.list = res.data.records
        tableData.value.totalPage = res.data.total
      }

      tableData.value.loading = false
    }

    onMounted(() => {
      getPage()
    })

    return {
      reset,
      getPage,
      tableData
    }
  }
})
</script>
