<template>
  <hb-drawer-layout
    v-model="isShow"
    :title="loginOperateDrawerDeploy.title"
  >
    <el-table size="mini" :data="tableData.list" border style="width: 100%">
      <el-table-column prop="loginTime" align="center" label="登录时间" width='210'></el-table-column>
      <el-table-column prop="clientId" align="center" label="客户端id" width='250'></el-table-column>
      <el-table-column prop="platform" align="center" label="登录平台" width='80'></el-table-column>
      <el-table-column prop="ipAddress" align="center" label="地区" width='230'></el-table-column>
      <el-table-column prop="ip" align="center" label="登录ip" width='200'></el-table-column>
      <el-table-column prop="ua" align="center" label="UA信息" min-width='200'>
        <template #default="scope">
          <el-tooltip :content="scope.row.ua" placement="top">
            <span>{{ parseUA(scope.row.ua) }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="130">
        <template #default="scope">
          <el-button @click="handleOffline(scope.row)" type="text" style="color: red">下线</el-button>
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
      @current-change="pageNoChange"
    >
    </el-pagination>
  </hb-drawer-layout>
</template>

<script lang='ts'>
import UAParser from 'ua-parser-js'
import { self } from '@/common'
import { defineComponent, ref } from 'vue'
import { createPage } from '../../../common/page'

export default defineComponent ({
  name: 'LoginOperateDrawer',
  setup() {
    const context = self()

    let userId = ''

    const open = (data: any) => {
      userId = data
      tableData.searchCondition.userId = userId
      handleSearch()
      isShow.value = true
    }

    const {
      pageData: tableData,
      defaultDataLoader: handleSearch,
      pageNoChange,
      pageSizeChange,
      pageConditionSearch,
      defaultPageReset: handleReset
    } = createPage({
      conditions: {
        userId: {
          default: userId,
          reset: userId
        },
      },
      dataAPI: context.$api.queryLoginHistory
    })

    const isShow = ref(false)
    const loginOperateDrawerDeploy: any = {
      title: '登录管理'
    }

    const parseUA = (ua: string) => {
      const parser = new UAParser()
      parser.setUA(ua)
      const res = parser.getResult()
      let osName = res.os.name ? res.os.name : '-'
      let browserName = res.browser.name ? res.browser.name : '-'
      return '操作系统：'+osName + ' | 浏览器名称：' + browserName
    }

    const handleOffline = (row: any) => {

    }

    return {
      isShow,
      loginOperateDrawerDeploy,
      tableData,
      handleSearch,
      pageNoChange,
      pageSizeChange,
      pageConditionSearch,
      handleReset,
      handleOffline,
      open,
      parseUA
    }
  }
})
</script>

<style scoped>

</style>