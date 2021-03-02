<template>
  <hb-drawer-layout
    v-model="isShow"
    :title="loginLogDrawerDeploy.title"
    size='800px'
  >
      <el-table
        size="mini"
        :data="tableData.list"
        border
        v-loading="tableData.loading"
        style="width: 100%"
      >
        <el-table-column prop="operationTime" align="center" label="操作时间" width='200'></el-table-column>
        <el-table-column prop="operationType" align="center" label="操作类型" width='180'>
          <template #default="scope">
                <span>
                  {{ dataDict.SECURITY_OPERATION?.mappings[scope.row.operationType] }}
                </span>
          </template>
        </el-table-column>
        <el-table-column prop="clientId" align="center" label="客户端id" width='300'></el-table-column>
        <el-table-column prop="operationPlatform" align="center" label="操作平台" width='110'>
          <template #default="scope">
                <span>
                  {{ dataDict.APP_PLATFORM?.mappings[scope.row.operationPlatform] }}
                </span>
          </template>
        </el-table-column>
        <el-table-column prop="ipAddress" align="center" label="ip位置" width='230'></el-table-column>
        <el-table-column prop="ip" align="center" label="操作ip" width='200'></el-table-column>
        <el-table-column prop="ua" align="center" label="UA信息" min-width='300'>
          <template #default="scope">
            <el-tooltip :content="scope.row.ua" placement="top">
              <span>{{ parseUA(scope.row.ua) }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div style='text-align: center;padding-bottom: 20px;'>
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
      </div>
  </hb-drawer-layout>
</template>

<script lang='ts'>
import UAParser from 'ua-parser-js'
import { self } from '@/common'
import { defineComponent, ref } from 'vue'
import { loadDict } from '@/common/dict'
import { createPage } from '@/common/page'

export default defineComponent ({
  name: 'LoginOperateDrawer',
  setup() {
    const context = self()

    const { dataDict } = loadDict(['SECURITY_OPERATION','APP_PLATFORM'])


    const userId = ref('')

    const isShow = ref(false)
    const loginLogDrawerDeploy: any = {
      title: '登录日志'
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
          default: userId.value,
          reset: userId.value
        }
      },
      dataAPI: context.$api.querySecurityLog
    })

    const open = (data: any) => {
      userId.value = data
      tableData.searchCondition.userId = userId.value
      isShow.value = true
      handleSearch()

    }

    const parseUA = (ua: string) => {
      const parser = new UAParser()
      parser.setUA(ua)
      const res = parser.getResult()
      let osName = res.os.name ? res.os.name : '-'
      let browserName = res.browser.name ? res.browser.name : '-'
      return '操作系统：'+osName + ' | 浏览器名称：' + browserName
    }

    return {
      isShow,
      loginLogDrawerDeploy,
      dataDict,
      tableData,
      handleSearch,
      pageNoChange,
      pageSizeChange,
      pageConditionSearch,
      handleReset,
      open,
      parseUA
    }
  }
})
</script>

<style scoped>

</style>